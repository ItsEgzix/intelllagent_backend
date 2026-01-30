"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const prisma_config_1 = require("../prisma.config");
const bcrypt = __importStar(require("bcrypt"));
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
dotenv.config();
const prisma = new client_1.PrismaClient({ adapter: prisma_config_1.adapter });
async function main() {
    console.log('🌱 Starting seed...');
    const superadminEmail = process.env.SUPERADMIN_EMAIL || 'superadmin@intellagent.com';
    const superadminPassword = process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!';
    const superadminName = process.env.SUPERADMIN_NAME || 'Super Admin';
    const existingSuperadmin = await prisma.user.findUnique({
        where: { email: superadminEmail },
    });
    if (existingSuperadmin) {
        if (existingSuperadmin.role !== 'superadmin') {
            const hashedPassword = await bcrypt.hash(superadminPassword, 10);
            await prisma.user.update({
                where: { email: superadminEmail },
                data: {
                    role: 'superadmin',
                    password: hashedPassword,
                    name: superadminName,
                },
            });
            console.log(`✅ Updated user ${superadminEmail} to superadmin role`);
        }
        else {
            if (process.env.SUPERADMIN_PASSWORD) {
                const hashedPassword = await bcrypt.hash(superadminPassword, 10);
                await prisma.user.update({
                    where: { email: superadminEmail },
                    data: {
                        password: hashedPassword,
                        name: superadminName,
                    },
                });
                console.log(`✅ Updated superadmin ${superadminEmail} password`);
            }
            else {
                console.log(`ℹ️  Superadmin ${superadminEmail} already exists`);
            }
        }
    }
    else {
        const hashedPassword = await bcrypt.hash(superadminPassword, 10);
        const superadmin = await prisma.user.create({
            data: {
                email: superadminEmail,
                password: hashedPassword,
                name: superadminName,
                role: 'superadmin',
                isAgent: false,
                isActive: true,
                timezone: 'Asia/Kuala_Lumpur',
            },
        });
        console.log('✅ Superadmin created successfully!');
        console.log(`   Email: ${superadmin.email}`);
        console.log(`   Name: ${superadmin.name}`);
        console.log(`   Role: ${superadmin.role}`);
        console.log(`   Password: ${superadminPassword}`);
        console.log('\n⚠️  Please change the default password after first login!');
    }
    await seedTranslations();
    console.log('\n✨ Seed completed!');
}
const LANGUAGE_DISPLAY_NAMES = {
    en: { native: 'English', english: 'English' },
    zh: { native: '中文', english: 'Chinese' },
    ms: { native: 'Bahasa Melayu', english: 'Malay' },
    fr: { native: 'Français', english: 'French' },
    ja: { native: '日本語', english: 'Japanese' },
    vi: { native: 'Tiếng Việt', english: 'Vietnamese' },
    es: { native: 'Español', english: 'Spanish' },
    de: { native: 'Deutsch', english: 'German' },
    ar: { native: 'العربية', english: 'Arabic' },
    hi: { native: 'हिन्दी', english: 'Hindi' },
    pt: { native: 'Português', english: 'Portuguese' },
    ru: { native: 'Русский', english: 'Russian' },
    it: { native: 'Italiano', english: 'Italian' },
    th: { native: 'ไทย', english: 'Thai' },
    id: { native: 'Bahasa Indonesia', english: 'Indonesian' },
    tr: { native: 'Türkçe', english: 'Turkish' },
    pl: { native: 'Polski', english: 'Polish' },
    nl: { native: 'Nederlands', english: 'Dutch' },
};
async function seedTranslations() {
    try {
        const messagesDir = path.resolve(__dirname, '..', '..', 'intellagent-webapp', 'messages');
        if (!fs.existsSync(messagesDir)) {
            console.warn('⚠️  Messages directory not found, skipping translations seed');
            return;
        }
        const files = fs
            .readdirSync(messagesDir)
            .filter((file) => file.endsWith('.json') && file.toLowerCase() !== 'languages.json');
        for (const file of files) {
            const code = path.basename(file, '.json');
            const fullPath = path.join(messagesDir, file);
            const rawContent = fs.readFileSync(fullPath, 'utf-8');
            const data = JSON.parse(rawContent);
            const displayNames = LANGUAGE_DISPLAY_NAMES[code.toLowerCase()] || {
                native: code.toUpperCase(),
                english: code.toUpperCase(),
            };
            await prisma.translation.upsert({
                where: { code },
                update: {
                    data,
                    nativeName: displayNames.native,
                    englishName: displayNames.english,
                },
                create: {
                    code,
                    data,
                    nativeName: displayNames.native,
                    englishName: displayNames.english,
                },
            });
            console.log(`✅ Seeded translations for locale "${code}" (${displayNames.english})`);
        }
    }
    catch (error) {
        console.error('❌ Failed to seed translations:', error);
    }
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map