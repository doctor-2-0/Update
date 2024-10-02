// prisma/seed.ts
const { PrismaClient, Role, AppointmentStatus } = require("@prisma/client");
const { faker } = require("@faker-js/faker");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

const TODAY = new Date(2024, 9, 2); // October 2, 2024

const doctorImageLinks = [
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290984774852284486/OIP.jpg?ex=66fe72c3&is=66fd2143&hm=1c359ef3ba7bb6a9f2dce4769d968f84cb35a7d8e7bbb411c01df6f09765d071&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290984872952725524/download.jpg?ex=66fe72db&is=66fd215b&hm=7e18c0c2eb10ab31502aabbfcead4b01a49f53a685f86646b2fb0f51b7a88be6&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290984948005605456/OIP.jpg?ex=66fe72ec&is=66fd216c&hm=594a3578064fb2edd2630fa083d8010f641d6574e67d68d1a7bb7e5c26756485&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290985140620886037/wp2655110.webp?ex=66fe731a&is=66fd219a&hm=c9bcf671ff9cf56d2e743f01ac537fb8c0489a27cf47dc5d1c17d97be0adadb6&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290985166302609463/doctor-portrait-21332357.webp?ex=66fe7320&is=66fd21a0&hm=b65a367dd19fd8926f638d1892c3f07a7bbfe694c8914513adf28f8a75051ff7&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290986214391939113/doctor-nurse.jpg?ex=66fe741a&is=66fd229a&hm=16bd810d7102fe3745eb4b38a5153928b5e174c4549504e4284d566f7e5606b4&",
  "https://cdn.discordapp.com/attachments/1254814771140890707/1290986377009430630/smiling-medical-doctor-woman-stethoscope-22751152.webp?ex=66fe7441&is=66fd22c1&hm=17bc3a3f679677a119a3093718f3c8972181df586714238a3672f7f654594ee9&",
];

async function main() {
  const PASSWORD = "password123";
  const hashedPassword = await bcrypt.hash(PASSWORD, 10);

  // Create users (doctors and patients)
  const users = await Promise.all(
    Array.from({ length: 50 }).map(async (_, index) => {
      const role = index < 20 ? Role.Doctor : Role.Patient;
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();

      const tunisiaLatitude = faker.location.latitude({ min: 30, max: 37 });
      const tunisiaLongitude = faker.location.longitude({ min: 8, max: 11 });

      let profilePictureData = undefined;
      if (role === Role.Doctor) {
        profilePictureData = {
          create: {
            url: faker.helpers.arrayElement(doctorImageLinks),
          },
        };
      }

      return prisma.user.create({
        data: {
          firstName,
          lastName,
          username: faker.internet.userName(),
          password: hashedPassword,
          email: faker.internet.email(),
          role,
          speciality:
            role === Role.Doctor
              ? faker.helpers.arrayElement([
                  "Cardiology",
                  "Dermatology",
                  "Neurology",
                  "Pediatrics",
                  "Oncology",
                  "Orthopedics",
                  "Psychiatry",
                  "Gynecology",
                  "Urology",
                  "Endocrinology",
                ])
              : null,
          locationLatitude: tunisiaLatitude,
          locationLongitude: tunisiaLongitude,
          bio: faker.lorem.paragraph(),
          meetingPrice:
            role === Role.Doctor
              ? faker.number.float({ min: 50, max: 300, precision: 2 })
              : null,
          profilePicture: profilePictureData,
        },
      });
    })
  );

  const doctors = users.filter((user) => user.role === Role.Doctor);
  const patients = users.filter((user) => user.role === Role.Patient);

  // Create appointments
  await Promise.all(
    doctors.flatMap((doctor) =>
      Array.from({ length: faker.number.int({ min: 3, max: 10 }) }).map(() =>
        prisma.appointment.create({
          data: {
            patientId: faker.helpers.arrayElement(patients).id,
            doctorId: doctor.id,
            appointmentDate: faker.date.between({
              from: TODAY,
              to: new Date(TODAY.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days from today
            }),
            durationMinutes: faker.helpers.arrayElement([30, 45, 60]),
            status: faker.helpers.arrayElement(
              Object.values(AppointmentStatus)
            ),
          },
        })
      )
    )
  );

  // Create chatrooms and messages
  await Promise.all(
    Array.from({ length: 30 }).map(async () => {
      const chatroom = await prisma.chatroom.create({
        data: {
          patientId: faker.helpers.arrayElement(patients).id,
          doctorId: faker.helpers.arrayElement(doctors).id,
          startTime: faker.date.past({ refDate: TODAY }),
        },
      });

      await Promise.all(
        Array.from({ length: faker.number.int({ min: 5, max: 20 }) }).map(() =>
          prisma.chatroomMessage.create({
            data: {
              chatroomId: chatroom.id,
              senderId: faker.helpers.arrayElement([
                chatroom.patientId,
                chatroom.doctorId,
              ]),
              messageText: faker.lorem.sentence(),
              sentAt: faker.date.between({
                from: chatroom.startTime,
                to: TODAY,
              }),
            },
          })
        )
      );
    })
  );

  // Create media (profile pictures)
  // await Promise.all(
  //   users.map((user) =>
  //     prisma.media.create({
  //       data: {
  //         userId: user.id,
  //         url:
  //           user.role === Role.Doctor
  //             ? faker.image.urlLoremFlickr({ category: "people" })
  //             : faker.image.avatar(),
  //       },
  //     })
  //   )
  // );

  // Create availability for doctors
  await Promise.all(
    doctors.flatMap((doctor) =>
      Array.from({ length: 14 }).map((_, index) => {
        const availableDate = new Date(
          TODAY.getTime() + index * 24 * 60 * 60 * 1000
        );
        return prisma.availability.create({
          data: {
            doctorId: doctor.id,
            availableDate,
            startTime: faker.date
              .future({ refDate: availableDate })
              .toTimeString()
              .slice(0, 5),
            endTime: faker.date
              .future({ refDate: availableDate })
              .toTimeString()
              .slice(0, 5),
            isAvailable: faker.datatype.boolean(),
          },
        });
      })
    )
  );

  // Create doctor reviews
  await Promise.all(
    Array.from({ length: 100 }).map(() =>
      prisma.doctorReview.create({
        data: {
          patientId: faker.helpers.arrayElement(patients).id,
          doctorId: faker.helpers.arrayElement(doctors).id,
          rating: faker.number.int({ min: 1, max: 5 }),
          reviewText: faker.lorem.paragraph(),
          reviewDate: faker.date.past({ refDate: TODAY }),
        },
      })
    )
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
