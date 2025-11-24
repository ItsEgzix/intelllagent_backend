import { PrismaClient } from '../generated/prisma/client';
import { adapter } from '../prisma.config';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

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

  console.log('\n✨ Seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
