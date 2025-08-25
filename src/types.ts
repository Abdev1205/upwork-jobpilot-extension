export interface SearchProfile {
  id: string;
  name: string;
  keywords: string;
  description?: string;
  color: string;
}

export interface StorageData {
  profiles: SearchProfile[];
  activeProfile?: string;
}

export const DEFAULT_PROFILES: SearchProfile[] = [
  {
    id: "frontend-heavy",
    name: "Frontend Heavy",
    keywords:
      "React developer, React.js, Next.js developer, frontend developer, MERN stack, Tailwind CSS, Redux, Typescript, JavaScript, UI developer, Web app development",
    description: "React/Next.js focused jobs",
    color: "#3B82F6",
  },
  {
    id: "backend-heavy",
    name: "Backend Heavy",
    keywords:
      "Node.js developer, Express.js, REST API, GraphQL, backend developer, API integration, Payment gateway, Stripe integration, MongoDB, PostgreSQL, Redis, Docker, NGINX, AWS, Azure, Microservices",
    description: "Node/DevOps/API focused jobs",
    color: "#10B981",
  },
  {
    id: "fullstack",
    name: "Full Stack",
    keywords:
      "Full stack developer, MERN stack developer, React.js, Next.js, Node.js, SaaS development, Dashboard development, Marketplace website, Chrome extension developer, Bug fixing, Website optimization",
    description: "Broad full-stack opportunities",
    color: "#8B5CF6",
  },
];

export const PROFILE_COLORS = [
  "#3B82F6",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#14B8A6",
  "#F97316",
  "#84CC16",
  "#6366F1",
];
