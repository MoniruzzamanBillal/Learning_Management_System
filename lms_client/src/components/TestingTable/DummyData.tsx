export type TDataprops = {
  id: string;
  name: string;
  category: string;
  price: number;
  published: boolean;
};

export const dummyCourseData: TDataprops[] = [
  {
    id: "a1b2c3d4",
    name: "Wireless Mouse",
    price: 29.99,
    category: "Electronics",
    published: true,
  },
  {
    id: "e5f6g7h8",
    name: "Yoga Mat",
    price: 19.99,
    category: "Fitness",
    published: false,
  },
  {
    id: "i9j0k1l2",
    name: "Desk Lamp",
    price: 34.99,
    category: "Home Decor",
    published: true,
  },
  {
    id: "m3n4o5p6",
    name: "Bluetooth Speaker",
    price: 49.99,
    category: "Electronics",
    published: true,
  },
  {
    id: "q7r8s9t0",
    name: "Water Bottle",
    price: 14.99,
    category: "Fitness",
    published: false,
  },
  {
    id: "u1v2w3x4",
    name: "Notebook",
    price: 5.99,
    category: "Stationery",
    published: true,
  },
  {
    id: "y5z6a7b8",
    name: "Office Chair",
    price: 89.99,
    category: "Furniture",
    published: true,
  },
  {
    id: "c9d0e1f2",
    name: "Sunglasses",
    price: 24.99,
    category: "Accessories",
    published: false,
  },
  {
    id: "g3h4i5j6",
    name: "Gaming Keyboard",
    price: 59.99,
    category: "Electronics",
    published: true,
  },
  {
    id: "k7l8m9n0",
    name: "Travel Backpack",
    price: 39.99,
    category: "Travel",
    published: false,
  },
];

export type TEnrollmentDummyData = {
  id: string;
  courseName: string;
  enrolledStudents: number;
};

export const dummyEnrollmentData: TEnrollmentDummyData[] = [
  {
    id: "k7l8m9n0",
    courseName: "Frontend Development",
    enrolledStudents: 30,
  },
  {
    id: "a1b2c3d4",
    courseName: "Backend Development",
    enrolledStudents: 25,
  },
  {
    id: "e5f6g7h8",
    courseName: "Full Stack Web Development",
    enrolledStudents: 40,
  },
  {
    id: "i9j0k1l2",
    courseName: "React for Beginners",
    enrolledStudents: 22,
  },
  {
    id: "m3n4o5p6",
    courseName: "Node.js Essentials",
    enrolledStudents: 18,
  },
  {
    id: "q7r8s9t0",
    courseName: "MongoDB Mastery",
    enrolledStudents: 15,
  },
  {
    id: "u1v2w3x4",
    courseName: "CSS and Tailwind",
    enrolledStudents: 28,
  },
  {
    id: "y5z6a7b8",
    courseName: "JavaScript Advanced Concepts",
    enrolledStudents: 35,
  },
  {
    id: "c9d0e1f2",
    courseName: "TypeScript Fundamentals",
    enrolledStudents: 20,
  },
  {
    id: "g3h4i5j6",
    courseName: "Express.js Deep Dive",
    enrolledStudents: 17,
  },
  {
    id: "k7l8m9n1",
    courseName: "API Development with REST",
    enrolledStudents: 27,
  },
  {
    id: "o2p3q4r5",
    courseName: "Next.js Crash Course",
    enrolledStudents: 32,
  },
];

export type TInstructorDummyData = {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
};

export const dummyInstructorData: TInstructorDummyData[] = [
  {
    id: "k7l8m9n0",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "a1b2c3d4",
    name: "Bob Smith",
    email: "bob.smith@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "e5f6g7h8",
    name: "Catherine Lee",
    email: "catherine.lee@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "i9j0k1l2",
    name: "David Brown",
    email: "david.brown@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "m3n4o5p6",
    name: "Eva Green",
    email: "eva.green@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "q7r8s9t0",
    name: "Frank Harris",
    email: "frank.harris@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "u1v2w3x4",
    name: "Grace Kim",
    email: "grace.kim@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "y5z6a7b8",
    name: "Henry Adams",
    email: "henry.adams@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "c9d0e1f2",
    name: "Isabella Moore",
    email: "isabella.moore@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
  {
    id: "g3h4i5j6",
    name: "Jack Wilson",
    email: "jack.wilson@example.com",
    profilePicture:
      "https://res.cloudinary.com/drmkqpdex/image/upload/v1741693865/user%201.jpg",
  },
];

export type TdummyManageAssignCourse = {
  id: string;
  name: string;
  category: string;
  courseCover: string;
};

export const dummyManageAssignCourse: TdummyManageAssignCourse[] = [
  {
    id: "a1b2c3d4",
    name: "Mastering Frontend Development",
    category: "Web Development",
    courseCover:
      "https://res.cloudinary.com/dupxfufq9/image/upload/v1745295971/Mastering%20Frontend%20Development%20with%20js%20batch%201.jpg",
  },
  {
    id: "e5f6g7h8",
    name: "Introduction to Python Programming",
    category: "Programming",
    courseCover:
      "https://res.cloudinary.com/dupxfufq9/image/upload/v1745295971/Mastering%20Frontend%20Development%20with%20js%20batch%201.jpg",
  },
  {
    id: "i9j0k1l2",
    name: "Data Science Bootcamp",
    category: "Data Science",
    courseCover:
      "https://res.cloudinary.com/dupxfufq9/image/upload/v1745295971/Mastering%20Frontend%20Development%20with%20js%20batch%201.jpg",
  },
  {
    id: "m3n4o5p6",
    name: "UI/UX Design Essentials",
    category: "Design",
    courseCover:
      "https://res.cloudinary.com/dupxfufq9/image/upload/v1745295971/Mastering%20Frontend%20Development%20with%20js%20batch%201.jpg",
  },
];
