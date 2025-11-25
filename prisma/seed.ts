import { PrismaClient } from '../generated/prisma/client';
import { adapter } from '../prisma.config';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting seed...');

  // Superadmin credentials from environment or defaults
  const superadminEmail =
    process.env.SUPERADMIN_EMAIL || 'superadmin@intellagent.com';
  const superadminPassword =
    process.env.SUPERADMIN_PASSWORD || 'SuperAdmin123!';
  const superadminName = process.env.SUPERADMIN_NAME || 'Super Admin';

  // Check if superadmin already exists
  const existingSuperadmin = await prisma.user.findUnique({
    where: { email: superadminEmail },
  });

  if (existingSuperadmin) {
    // Update existing user to superadmin if not already
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
    } else {
      // Update password if provided
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
      } else {
        console.log(`ℹ️  Superadmin ${superadminEmail} already exists`);
      }
    }
  } else {
    // Hash password
    const hashedPassword = await bcrypt.hash(superadminPassword, 10);

    // Create superadmin user
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

// Language display names mapping
const LANGUAGE_DISPLAY_NAMES: Record<
  string,
  { native: string; english: string }
> = {
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
    const messagesDir = path.resolve(
      __dirname,
      '..',
      '..',
      'intellagent-webapp',
      'messages',
    );

    if (!fs.existsSync(messagesDir)) {
      console.warn(
        '⚠️  Messages directory not found, skipping translations seed',
      );
      return;
    }

    const files = fs
      .readdirSync(messagesDir)
      .filter(
        (file) =>
          file.endsWith('.json') && file.toLowerCase() !== 'languages.json',
      );

    for (const file of files) {
      const code = path.basename(file, '.json');
      const fullPath = path.join(messagesDir, file);
      const rawContent = fs.readFileSync(fullPath, 'utf-8');
      const data = JSON.parse(rawContent);

      // Get display names from mapping
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

      console.log(
        `✅ Seeded translations for locale "${code}" (${displayNames.english})`,
      );
    }
  } catch (error) {
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
