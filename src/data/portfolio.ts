import { Project, Experience, Achievement, Skill } from '../types';

export const projects: Project[] = [
  {
    id: 'fullstack-ecommerce',
    title: 'E-Commerce Platform',
    description: 'A complete e-commerce solution with React, Node.js, and PostgreSQL. Features include user authentication, payment integration, and admin dashboard.',
    image: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Stripe'],
    githubUrl: 'https://github.com/yourusername/ecommerce-platform',
    liveUrl: 'https://ecommerce-demo.vercel.app',
    videoUrl: 'https://youtube.com/watch?v=demo1'
  },
  {
    id: 'fastapi-ml-service',
    title: 'Machine Learning API',
    description: 'FastAPI-based ML service for image classification with Docker deployment and CI/CD pipeline.',
    image: 'https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Python', 'FastAPI', 'TensorFlow', 'Docker', 'AWS'],
    githubUrl: 'https://github.com/yourusername/ml-api',
    videoUrl: 'https://youtube.com/watch?v=demo2'
  },
  {
    id: 'rust-blockchain',
    title: 'Blockchain Network',
    description: 'Custom blockchain implementation in Rust with consensus mechanism and smart contract support.',
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Rust', 'WebAssembly', 'Cryptography', 'P2P'],
    githubUrl: 'https://github.com/yourusername/rust-blockchain',
    videoUrl: 'https://youtube.com/watch?v=demo3'
  },
  {
    id: 'nextjs-dashboard',
    title: 'Analytics Dashboard',
    description: 'Real-time analytics dashboard built with Next.js, featuring interactive charts and data visualization.',
    image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=800',
    technologies: ['Next.js', 'TypeScript', 'Chart.js', 'MongoDB'],
    githubUrl: 'https://github.com/yourusername/analytics-dashboard',
    liveUrl: 'https://dashboard-demo.vercel.app'
  }
];

export const experiences: Experience[] = [
  {
    id: 'senior-fullstack',
    company: 'TechCorp Solutions',
    position: 'Senior Full Stack Developer',
    duration: '2022 - Present',
    description: 'Lead development of scalable web applications using React, Node.js, and cloud technologies. Mentor junior developers and architect system solutions.',
    technologies: ['React', 'Node.js', 'AWS', 'PostgreSQL', 'Docker']
  },
  {
    id: 'fullstack-dev',
    company: 'StartupXYZ',
    position: 'Full Stack Developer',
    duration: '2020 - 2022',
    description: 'Developed and maintained multiple client applications, implemented CI/CD pipelines, and optimized database performance.',
    technologies: ['Python', 'FastAPI', 'React', 'MongoDB', 'Docker']
  },
  {
    id: 'backend-dev',
    company: 'DevAgency',
    position: 'Backend Developer',
    duration: '2019 - 2020',
    description: 'Built robust APIs and microservices, integrated third-party services, and ensured system scalability and security.',
    technologies: ['Node.js', 'Express', 'MySQL', 'Redis', 'AWS']
  }
];

export const achievements: Achievement[] = [
  {
    id: 'aws-certified',
    title: 'AWS Solutions Architect',
    description: 'Professional certification in cloud architecture and deployment strategies',
    date: '2023',
    type: 'certification'
  },
  {
    id: 'hackathon-winner',
    title: 'Global Hackathon Winner',
    description: 'First place in international blockchain development competition',
    date: '2022',
    type: 'award'
  },
  {
    id: 'open-source',
    title: '10K+ GitHub Stars',
    description: 'Reached 10,000+ stars across open source projects',
    date: '2023',
    type: 'milestone'
  },
  {
    id: 'tech-speaker',
    title: 'Conference Speaker',
    description: 'Keynote speaker at 5+ international tech conferences',
    date: '2023',
    type: 'award'
  }
];

export const skills: Skill[] = [
  // Frontend (6 skills) - Cygnus constellation (Northern Cross)
  { name: 'React', level: 95, category: 'frontend' },
  { name: 'Next.js', level: 90, category: 'frontend' },
  { name: 'TypeScript', level: 92, category: 'frontend' },
  { name: 'Redux/Zustand', level: 95, category: 'frontend' },
  { name: 'Threejs', level: 80, category: 'frontend' },
  { name: 'React-Query', level: 88, category: 'frontend' },
  
  // Backend (7 skills) - Orion constellation (The Hunter)
  { name: 'Node.js/Express', level: 88, category: 'backend' },
  { name: 'Prisma', level: 85, category: 'backend' },
  { name: 'Python', level: 90, category: 'backend' },
  { name: 'FastAPI', level: 85, category: 'backend' },
  { name: 'Rust', level: 75, category: 'backend' },
  { name: 'GraphQL', level: 78, category: 'backend' },
  { name: 'PostMan', level: 82, category: 'backend' },
  
  // Database (4 skills) - Andromeda constellation (Graceful curve)
  { name: 'PostgreSQL', level: 85, category: 'database' },
  { name: 'MongoDB', level: 80, category: 'database' },
  { name: 'Redis', level: 75, category: 'database' },
  { name: 'SQLite', level: 78, category: 'database' },
  
  // Tools (8 skills) - Sagittarius constellation (The Teapot)
  { name: 'Docker', level: 85, category: 'tools' },
  { name: 'AWS', level: 80, category: 'tools' },
  { name: 'Github', level: 90, category: 'tools' },
  { name: 'Jira', level: 70, category: 'tools' },
  { name: 'Github Actions', level: 85, category: 'tools' },
  { name: 'Terraform', level: 72, category: 'tools' },
  { name: 'Ansible', level: 68, category: 'tools' },
  { name: 'Nginx', level: 75, category: 'tools' },
  
  // Blockchain (5 skills) - Lyra constellation (The Harp)
  { name: 'Cryptography', level: 75, category: 'blockchain' },
  { name: 'Solidity', level: 70, category: 'blockchain' },
  { name: 'Viem', level: 72, category: 'blockchain' },
  { name: 'Forge', level: 78, category: 'blockchain' },
  { name: 'Move', level: 73, category: 'blockchain' }
];