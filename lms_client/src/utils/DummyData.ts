export type Module = {
  id: string;
  name: string;
};

export type CourseModule = {
  id: string;
  course: string;
  modules: Module[];
};

export const modulesDummyData: CourseModule[] = [
  {
    id: "1",
    course: "Web Development",
    modules: [
      { id: "1", name: "Intro to HTML" },
      { id: "2", name: "HTML Tags & Structure" },
      { id: "3", name: "Forms & Inputs" },
    ],
  },
  {
    id: "2",
    course: "JavaScript Basics",
    modules: [
      { id: "1", name: "Variables & Data Types" },
      { id: "2", name: "Functions" },
      { id: "3", name: "Loops & Conditions" },
    ],
  },
  {
    id: "3",
    course: "React Fundamentals",
    modules: [
      { id: "1", name: "JSX & Components" },
      { id: "2", name: "Props & State" },
      { id: "3", name: "useEffect Hook" },
    ],
  },
  {
    id: "4",
    course: "Node.js Crash Course",
    modules: [
      { id: "1", name: "Setting Up Node" },
      { id: "2", name: "Modules & FS" },
      { id: "3", name: "Express Basics" },
    ],
  },
  {
    id: "5",
    course: "MongoDB Essentials",
    modules: [
      { id: "1", name: "NoSQL vs SQL" },
      { id: "2", name: "CRUD Operations" },
      { id: "3", name: "Mongoose Basics" },
    ],
  },
  {
    id: "6",
    course: "Git & GitHub",
    modules: [
      { id: "1", name: "Git Init & Commit" },
      { id: "2", name: "Branches & Merging" },
      { id: "3", name: "Pushing to GitHub" },
    ],
  },
  {
    id: "7",
    course: "CSS Mastery",
    modules: [
      { id: "1", name: "Flexbox" },
      { id: "2", name: "Grid Layout" },
      { id: "3", name: "Responsive Design" },
    ],
  },
  {
    id: "8",
    course: "TypeScript Basics",
    modules: [
      { id: "1", name: "Types & Interfaces" },
      { id: "2", name: "Functions & Classes" },
      { id: "3", name: "Generics" },
    ],
  },
  {
    id: "9",
    course: "Next.js Overview",
    modules: [
      { id: "1", name: "Pages & Routing" },
      { id: "2", name: "SSR & SSG" },
      { id: "3", name: "API Routes" },
    ],
  },
  {
    id: "10",
    course: "Backend API Design",
    modules: [
      { id: "1", name: "REST Principles" },
      { id: "2", name: "Authentication" },
      { id: "3", name: "Validation & Error Handling" },
    ],
  },
];
