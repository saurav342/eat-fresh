require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/User');
const DeliveryPartner = require('../models/DeliveryPartner');
const Shop = require('../models/Shop');
const Product = require('../models/Product');
const Category = require('../models/Category');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eatfresh');
        console.log('📦 MongoDB Connected for seeding');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

// Seed data
const categories = [
    { name: 'Chicken', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDz28GJWS3Qb-cL3U895G4ddsAN9yKwB_IYze_Kd-LGGR18xK5WCqpKPI4LMCraddkt3nSTItbtEW_1rK3oMxDLzZ9jPRfoAq8reYLtXWxKolm0dNIQ0wYWLpSFbUTQXhrFdzPFZNhHdrsEfaHkjEGT_Mm7MkGuaFzv6K2FWbNjDQS7NCeyWnhdQYPXnDOZY73_2FhXihbDp7usxd_fuBlqOd7Coc0oMva43Glf83b4_UfiQzO2gVQ11Stae8iGWRjp4N5G6qDUYOrQ', order: 1 },
    { name: 'Mutton', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPNmJowleVlFHBGiGN_rRqV4F7jmgfEvIHMHzEA0WsjviC08CBmf5Gix8iUTA5ypOXNtNbz4pjVwe6wYNLDbvjTwO32h3dfYWOTrPgHIN9BwSGQc33FzJu44V4Rq0T769dHQu494EXCyrjrBZagqw0mt__hUGpT1rYQAI5tFLYUl1n-hql16uLVcbeR2dq5la6gVLs2ns8B4AM-Ws6j2L2oPcC_8dbxX1KJziokGyzMep3sF510dGDErshSWwtVkLuaWtzDA7Oz7LM', order: 2 },
    { name: 'Fish', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD_rPOpwddiCzLKJE8Oqq_HoG_dKKu5DNCE6XyaWqEBG94_nT6cQjZV3SuL_9fU2v9qIPKYmWn7hscPDPY1Mzj9rym_MS0byDd1Q2kp5hE4lPjlK3h46ZrZzaDQXLQE1LEj1ko2NYX3TCzz00RqIf1EMTSzPhwsQD9XVKGD_-LRRY8X043HD1TSoDcXrxREO0vz3_HEKzm3P3m6MwTN9SZm9bWxzNE2K4QgVSvdNNTfiVukNvm0jt6avzov_9mxryLIpuEaGO902880', order: 3 },
    { name: 'Eggs', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAnZkSwtQL9t8iTHdnckbmHRvd-uF0vWh0lMuymfd_tB_uz9rBxOrywBtkKuA8SFvt1gVssOOykMaD9KykHGWs4JxhmVamuo_YU0lafpTbgpBZjxOH6W9OaUgzng__zbLnsqlvbsbfp9BHK0qsodT18f-R3NpDCx5ucFEsP9lvF8TizXyvwWQcQ4oy-uwrzYEd7OU25HetF7U2LTSgX2k9IuJ_jtvP6XQNB2qODY3dioWb8FoETRJuLWyHNlnmISBwGbFkRkGyf7ww', order: 4 },
];

const shops = [
    {
        name: 'Varthur Fresh Chicken',
        rating: 4.8,
        reviewCount: 120,
        categories: ['Chicken', 'Eggs', 'Marinades'],
        address: 'Main Road, Varthur',
        timing: '8 AM - 8 PM',
        isOpen: true,
        freeDelivery: true,
        deliveryTime: '45 mins',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEcGQuddG-n2NWOY75fJ3H13ZJN6BhGMVeWkelARKUTZoVUmpS7uRnte8gm1RjT-UhnuOIdVhozgUm3VMqovv97rS6LQbTYccPBclUh0yA8rgDW_BUlauJdI0r3XX6AD0toM5X-TYJNYLXEdQRwsp_kf816sDj8MxHqIKaSXkcsIMrffvWa8-iPPiBP4ILQWZ2k1fSl2Tu3M8Lk1tpCMN5PzFgoHBHe-6uSfH8qflGHIh3gpSAdrktUvB2RHLjmfCOq5mistsph5pu',
        totalOrders: 2340,
        totalRevenue: 1456000,
    },
    {
        name: 'Royal Mutton Stall',
        rating: 4.5,
        reviewCount: 85,
        categories: ['Premium Mutton', 'Chops', 'Keema'],
        address: 'Market Square',
        timing: '8 AM - 8 PM',
        isOpen: true,
        freeDelivery: false,
        deliveryFee: 20,
        deliveryTime: '50 mins',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCh3gYUB5zUOuBQjblkZX4Q2jSPgZsCx-hHDk5UI3O_tZkzorGajAkb8eiS3sDuZFxlQIYy94L_vuDZndHo7DNfGxSP_gpFLYE9n5djoPnZQddq_QOSx7MSpWYo-0H3EBUk0XsPQQ2PNTPKVsZ6nt4C_ErAgQXaAYJDENk5PkNvsPkFV7HJNkBdx7kytvrw_kpPsOW18x95-qClPh-7BHzTWzCZT9WhJyUdou_-L_RN0IL_9i_QRfeEcQXO7gRhJj5l0P8aUpw7EPxg',
        totalOrders: 1890,
        totalRevenue: 2234000,
    },
    {
        name: 'Coastal Catch Fish Mart',
        rating: 4.2,
        reviewCount: 65,
        categories: ['Sea Fish', 'Prawns', 'Crabs'],
        address: 'Near Lake',
        timing: '8 AM - 8 PM',
        isOpen: true,
        freeDelivery: true,
        deliveryTime: '60 mins',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOBxNMQnFRiYFQg-Az7XXaneekGlf568c5WbfeaE5QIiwuaw-tmrX28EjfCVTqESneV7BLmkGAO844nNFA69YRyZLii7es5pVnVNuO5_BZNCwbw0j8Oi2RmYYpT6Oaxus94fLnx2YKUaW7ukQi35zzldKa1HEWGihY8HeStV9YhNa_OPSxhuwI1-YvToU5EbU_43cm-XxNT6LmTVCjbvnC89eBXyXTFv-GBMLkbAf7NtJRTFtRd_AQMywfKRyMDgDWxKlIpWuLLVLq',
        totalOrders: 876,
        totalRevenue: 945000,
    },
    {
        name: 'Organic Meats & Co.',
        rating: 4.9,
        reviewCount: 210,
        categories: ['Free Range Chicken', 'Organic Mutton'],
        address: 'Green Street',
        timing: '8 AM - 8 PM',
        isOpen: true,
        freeDelivery: true,
        deliveryTime: '45 mins',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBW330L-xF2w7b1HLutcUB8TN4TuYO-FOwLlC6jjgv2HR4ggm0t7PTrAUOlcGAaX2EMGSYFS6-EWQ_nLfLrxq-4YY_gJmQ4pwPK9RJBWfwke0SyCVj2Z3_3JgjISwkRRG84CFnW2ekxzYQwl8wUfCR8J1jpz8n8OAAb_BEz4dNoDyAZFfxzcNgMbCqXT-jgUN62FPCvGST4QxTIar6y8aNr6l7bix3mG_wdOl-AJIRLqU98SI1cGmKzRRWkUkrwBQ5WED7gXkQDDlbK',
        totalOrders: 1567,
        totalRevenue: 1890000,
    },
];

const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('🗑️ Clearing existing data...');
        await Promise.all([
            User.deleteMany({}),
            DeliveryPartner.deleteMany({}),
            Shop.deleteMany({}),
            Product.deleteMany({}),
            Category.deleteMany({}),
        ]);

        // Seed categories
        console.log('📁 Seeding categories...');
        await Category.insertMany(categories);

        // Seed shops
        console.log('🏪 Seeding shops...');
        const createdShops = await Shop.insertMany(shops);
        const shopIds = createdShops.map((shop) => shop._id);

        // Seed products (for first shop)
        console.log('🍗 Seeding products...');
        const products = [
            {
                shopId: shopIds[0],
                name: 'Farm Fresh Chicken Curry Cut',
                description: 'Tender, antibiotic-free chicken cuts perfect for Indian curries.',
                weight: '500g',
                pieces: '12-14 Pcs',
                price: 140,
                originalPrice: 160,
                discount: 12,
                category: 'Chicken',
                tags: ['Bestseller', 'Antibiotic Free'],
                isAvailable: true,
                serves: 4,
                features: ['Skinless', 'Hygienically Cleaned', 'Halal Certified'],
                source: 'Karnataka Farms',
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLI_gJGxnGTT5n4h3MEig9rL_zBqSi5zyoOfGw7meoZph7eb33RTyh1ip6wfkXiXQLCQV3OpWPrxpnxFI24TjuwCk969aQDp9r2hjD-Oto-8ZM45SCssOIlZi5hagD_i6zdoHnta21PAU9ZV8HjqyH7c1G674IBD12yYo2sWNEM1jLqItBnsHsx7-CjkPFl8yGx6teMXX76_5_zdNZxg0amAuCCbYRuBQ-ML7z901q9o7IUaoJxRul-SZC-o3GYbWMLw5MxnENfZ2r',
            },
            {
                shopId: shopIds[0],
                name: 'Premium Mutton Curry Cut',
                description: 'Premium quality mutton from grass-fed goats.',
                weight: '500g',
                price: 450,
                category: 'Mutton',
                tags: ['Premium'],
                isAvailable: true,
                features: ['Bone-in', 'Fresh Cut'],
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzbJn2nlSMNiXEh-nkgYplkX71vuMt6wqTQdRpB_5HeuDX9HWbxV6nzzwOdJlg4XWO42DK5sGzg10fvBD6pHbceklz5Xgke_QjtWaW-cQXSyzW0o54sMjGdM-v--d3C_4w0KfmCRXiCGqqPr4XPZR2WxQejEvBW0Udz5E9JwmXy4L2mqkH-ataNur-u0zj2wb8KYsEurZahPQFzxQI1NmK8421_vd4zl_T-7Qv0btZPmvmj4XTblcTBhj72nw6AybcMBonOr82plQn',
            },
            {
                shopId: shopIds[0],
                name: 'Rohu Fish (Bengali Cut)',
                description: 'Fresh Rohu fish cut in traditional Bengali style.',
                weight: '1kg',
                price: 220,
                category: 'Fish',
                tags: ['Fresh Catch'],
                isAvailable: true,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDroCJEgMO2PXrC8fE-vTXRZvu9RGDfJlCap4tbfE3uiaatjxj9vAbxPcirTWsvvrNyr6rwRO8_hrr99Pnpoz7Tnxjy3VJ00lk03wfUUlvGKIUanjn-3FrhC6wf-ahx-oITcnXmS0P3wIIsuptSxeB5KbhHxB6DdAt8EMgILVe6-O-5-16Vo33hszFe6Erv0Wo0nr9lee7Q9SzgSiMM5RNV76MFVfLDs5ex8PK8ekVUHxoP3gr9h-Sj3PI-sRsUixd-6JC4Rhxzjlhr',
            },
            {
                shopId: shopIds[0],
                name: 'Tiger Prawns (Cleaned)',
                description: 'Premium tiger prawns, cleaned and deveined.',
                weight: '250g',
                price: 380,
                category: 'Prawns',
                tags: ['Deveined'],
                isAvailable: true,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYOMkzNn0J2Yr5Lg3i2koQH2crYNYyLFK27bGYzg4fV9GAhpPHXrOaCzM_vksBBoTDncZlUpEFKIpVBKIjOopCWhkAIcW7fY0DmbHZa9QH0Z4ApZV76R7dViBT9G2ZPmJMoIe-5OgHzHapQbp37pqP_zXeOgsaG47WaObZwyWwQ93ls4SZXfz8MGHULL3yHihGryq9NShTagH8YCeT1f0W8KG8hkEFQWDmLno2S6KmBAdRu89wyZ_aTnef-oBGYFfJ-ZtA-VlFS9GN',
            },
            {
                shopId: shopIds[0],
                name: 'Chicken Boneless Breast',
                description: 'Lean chicken breast, cubed and ready for grilling.',
                weight: '500g',
                price: 180,
                category: 'Chicken',
                tags: ['Cubed'],
                isAvailable: true,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbjTL0UEayfKGnRXnH-jcBpR3JwDOhm2jK5A3MgghHERjKBNPYp-FNab3s1viKvJlEPG2U7Z_h-HHfj_TsQI4hfzRkiqi9eEcbokxgEkQy2WutQAAcBxVMXKyfnnawwPGv5230iX159tGOGd2goujXWVflLE6cYUggtqIrTBzllUj6zJ0h3HsSoo5aiSz3HmbNbK73N1tDJqs2Rpol5m7_vvzhpqB4FaSdAo5_ycUt8B5XJYlhs6jbuYJr4ybqw8WCY1w_8l5wrptc',
            },
            {
                shopId: shopIds[0],
                name: 'Chicken Drumsticks',
                description: 'Fresh chicken drumsticks, perfect for grilling and frying.',
                weight: '500g',
                price: 150,
                category: 'Chicken',
                tags: ['Skinless'],
                isAvailable: true,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-tUDr4qRrsB6ZAfs_MnwY2nbsOOhM2JLDvkbjknUAu4Dp9OwdJfGJU_Mv1lJ8-RDuSqElfiPsNld4K8QjozaEpBIyUr-klloabibkCGnXDvILCJUmPF5QjFAW4A_llQxk64ewJCtVTKk81KMshMeolYt1DNZ_TiOi9mTWTeP97VjLUNCE2RzLFkgWs6NnEwMRVEWTWUTwponGXrGxq6T1zJEMSJSbS7ZmqWSnXtPSrw66-nnSseExFm6Ww_Gt02LmDzvpNlqs4v5j',
            },
            {
                shopId: shopIds[1],
                name: 'Premium Mutton Chops',
                description: 'Tender mutton chops perfect for grilling.',
                weight: '500g',
                price: 650,
                category: 'Mutton',
                tags: ['Premium', 'Grilling'],
                isAvailable: true,
                image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzbJn2nlSMNiXEh-nkgYplkX71vuMt6wqTQdRpB_5HeuDX9HWbxV6nzzwOdJlg4XWO42DK5sGzg10fvBD6pHbceklz5Xgke_QjtWaW-cQXSyzW0o54sMjGdM-v--d3C_4w0KfmCRXiCGqqPr4XPZR2WxQejEvBW0Udz5E9JwmXy4L2mqkH-ataNur-u0zj2wb8KYsEurZahPQFzxQI1NmK8421_vd4zl_T-7Qv0btZPmvmj4XTblcTBhj72nw6AybcMBonOr82plQn',
            },
        ];
        await Product.insertMany(products);

        // Seed admin user
        console.log('👤 Seeding admin user...');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);
        await User.create({
            name: 'Admin User',
            email: 'admin@eatfresh.com',
            phone: '+91 99999 00000',
            password: hashedPassword,
            role: 'admin',
            status: 'active',
        });

        // Seed sample users
        console.log('👥 Seeding sample users...');
        const userPassword = await bcrypt.hash('user123', salt);
        await User.create({
            name: 'Priya Sharma',
            email: 'priya@gmail.com',
            phone: '+91 98765 43210',
            password: userPassword,
            addresses: [
                { label: 'Home', address: 'Sobha Dream Acres, Varthur', isDefault: true },
            ],
            status: 'active',
        });

        // Seed sample delivery partner
        console.log('🚴 Seeding sample delivery partner...');
        const dpPassword = await bcrypt.hash('dp123', salt);
        await DeliveryPartner.create({
            name: 'Rajesh Kumar',
            email: 'rajesh@eatfresh.com',
            phone: '+91 98765 11111',
            password: dpPassword,
            vehicleType: 'bike',
            vehicleNumber: 'KA 01 AB 1234',
            documentsVerified: true,
            status: 'online',
            rating: 4.8,
            ratingCount: 423,
            totalDeliveries: 1245,
            totalEarnings: 186750,
        });

        console.log('✅ Database seeded successfully!');
        console.log('\n📋 Seed Credentials:');
        console.log('   Admin: admin@eatfresh.com / admin123');
        console.log('   User: priya@gmail.com / user123');
        console.log('   Delivery Partner: +91 98765 11111 / dp123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
