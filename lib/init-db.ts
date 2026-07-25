import { prisma } from './prisma';
import * as bcrypt from 'bcryptjs';

/**
 * Auto-initializes the database with default accounts (Advisor & Sample Clients)
 * if the User table is currently empty (e.g. on fresh Vercel serverless deploys).
 */
export async function ensureSeeded() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return; // Already initialized
    }

    console.log('🌱 Database is empty. Running auto-initialization seed...');
    const hashedPassword = await bcrypt.hash('password', 10);

    // 1. Create Primary Advisor Account
    await prisma.user.create({
      data: {
        email: 'advisor@aksaarthi.com',
        password: hashedPassword,
        role: 'advisor',
      },
    });

    // 2. Create Custom Advisor Account for Admin
    await prisma.user.create({
      data: {
        email: 'kopalkhare2@gmail.com',
        password: hashedPassword,
        role: 'advisor',
      },
    });

    // 3. Create Advisor Profile
    await prisma.advisorProfile.create({
      data: {
        id: 'profile',
        name: 'AK Investments & Financial Services',
        email: 'advisor@aksaarthi.com',
        phone: '9876543210',
        company: 'AK Financial Solutions',
        arnNumber: 'ARN-123456',
        licenseNumber: 'LIC-789012',
      },
    });

    // 4. Create Sample Clients
    const sampleClients = [
      {
        id: 'client-001',
        firstName: 'Rajesh',
        lastName: 'Sharma',
        email: 'rajesh.sharma@email.com',
        dob: '1985-03-15',
        gender: 'male',
        phone: '9876543210',
        address: '42, MG Road, Sector 18',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        occupation: 'Software Engineer',
        maritalStatus: 'married',
        annualIncome: 2400000,
        riskProfile: 'moderate',
        status: 'active',
      },
      {
        id: 'client-002',
        firstName: 'Priya',
        lastName: 'Patel',
        email: 'priya.patel@email.com',
        dob: '1990-07-20',
        gender: 'female',
        phone: '9988776655',
        address: '15, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500033',
        occupation: 'Doctor',
        maritalStatus: 'married',
        annualIncome: 3600000,
        riskProfile: 'aggressive',
        status: 'active',
      },
      {
        id: 'client-003',
        firstName: 'Sneha',
        lastName: 'Gupta',
        email: 'sneha.gupta@email.com',
        dob: '1995-11-05',
        gender: 'female',
        phone: '9711223344',
        address: '88, Park Street',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700016',
        occupation: 'Product Manager',
        maritalStatus: 'single',
        annualIncome: 1800000,
        riskProfile: 'aggressive',
        status: 'active',
      },
      {
        id: 'client-004',
        firstName: 'Vikram',
        lastName: 'Verma',
        email: 'vikram.verma@email.com',
        dob: '1978-01-30',
        gender: 'male',
        phone: '9811223344',
        address: '102, Civil Lines',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302006',
        occupation: 'Business Owner',
        maritalStatus: 'married',
        annualIncome: 5000000,
        riskProfile: 'conservative',
        status: 'active',
      },
      {
        id: 'client-005',
        firstName: 'Ananya',
        lastName: 'Deshmukh',
        email: 'ananya.deshmukh@email.com',
        dob: '1992-09-12',
        gender: 'female',
        phone: '9655443322',
        address: '55, FC Road, Shivaji Nagar',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411005',
        occupation: 'Architect',
        maritalStatus: 'single',
        annualIncome: 1500000,
        riskProfile: 'moderate',
        status: 'active',
      },
    ];

    for (const cData of sampleClients) {
      const client = await prisma.client.create({
        data: cData,
      });

      // Create linked Client User
      await prisma.user.create({
        data: {
          email: cData.email,
          password: hashedPassword,
          role: 'client',
          clientId: client.id,
        },
      });
    }

    console.log('✅ Database auto-initialization complete.');
  } catch (error) {
    console.error('Failed to auto-seed database:', error);
  }
}
