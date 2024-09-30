// prisma/seed.ts
const { PrismaClient, Role, AppointmentStatus } = require("@prisma/client");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  // Create users (doctors and patients)
  const users = await Promise.all(
    Array.from({ length: 50 }).map(async (_, index) => {
      const role = index < 20 ? Role.Doctor : Role.Patient;
      return prisma.user.create({
        data: {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          username: faker.internet.userName(),
          password: faker.internet.password(),
          email: faker.internet.email(),
          role,
          speciality: role === Role.Doctor ? faker.person.jobArea() : null,
          locationLatitude: faker.location.latitude(),
          locationLongitude: faker.location.longitude(),
          bio: faker.lorem.paragraph(),
          meetingPrice:
            role === Role.Doctor
              ? faker.number.float({ min: 50, max: 300, precision: 2 })
              : null,
        },
      });
    })
  );

  const doctors = users.filter((user) => user.role === Role.Doctor);
  const patients = users.filter((user) => user.role === Role.Patient);

  // Create appointments
  await Promise.all(
    doctors.flatMap((doctor) =>
      Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() =>
        prisma.appointment.create({
          data: {
            patientId: faker.helpers.arrayElement(patients).id,
            doctorId: doctor.id,
            appointmentDate: faker.date.future(),
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
        },
      });

      await Promise.all(
        Array.from({ length: faker.number.int({ min: 1, max: 10 }) }).map(() =>
          prisma.chatroomMessage.create({
            data: {
              chatroomId: chatroom.id,
              senderId: faker.helpers.arrayElement([
                chatroom.patientId,
                chatroom.doctorId,
              ]),
              messageText: faker.lorem.sentence(),
            },
          })
        )
      );
    })
  );

  // Create media (profile pictures)
  await Promise.all(
    users.map((user) =>
      prisma.media.create({
        data: {
          userId: user.id,
          url: faker.image.avatar(),
        },
      })
    )
  );

  // Create availability for doctors
  await Promise.all(
    doctors.flatMap((doctor) =>
      Array.from({ length: 7 }).map((_, index) =>
        prisma.availability.create({
          data: {
            doctorId: doctor.id,
            availableDate: faker.date.soon({ days: index + 1 }),
            startTime: faker.date.future().toTimeString().slice(0, 5),
            endTime: faker.date.future().toTimeString().slice(0, 5),
            isAvailable: faker.datatype.boolean(),
          },
        })
      )
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
          reviewDate: faker.date.past(),
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
