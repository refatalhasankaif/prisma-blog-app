import { prisma } from "../lib/prisma"
import { UserRole } from "../middleware/authMiddleware"

async function seedAdmin() {
    try {
        console.log(`
---------------------------
|| Admin seeding started ||
---------------------------
`);

        const adminData = {
            name: "Admin pagla",
            email: "admin@badmin.com",
            role: UserRole.ADMIN,
            password: "01758055919@Admin",
        }

        console.log(`
---------------------------------
|| Checking exsistence of user ||
---------------------------------
`);
        // check user exsist in db
        const existingUser = await prisma.user.findUnique({
            where: {
                email: adminData.email
            }
        })
        if (existingUser) {
            throw new Error("User already exist in DB");
        }

        const signUpAdmin = await fetch("http://localhost:5000/api/auth/sign-up/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Origin": "http://localhost:4000"
            },
            body: JSON.stringify(adminData)
        })

        console.log(signUpAdmin)

        if (signUpAdmin.ok) {
            console.log(`
-------------------
|| Admin created ||
-------------------
`);
            await prisma.user.update({
                where: {
                    email: adminData.email
                },
                data: {
                    emailVerified: true
                }
            })

            console.log(`
---------------------------------------
|| Email verification status updated ||
---------------------------------------
`);
        }
        console.log(`
---------------------------------
|| ********* Success ********* ||
---------------------------------
`);
    } catch (error) {
        console.log(error)
    }
}

seedAdmin()