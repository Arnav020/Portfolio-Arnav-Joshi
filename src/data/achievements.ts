import { Achievement } from '@/types'

export const achievements: Achievement[] = [
  {
    title: 'Merit Scholarship × 3',
    description:
      'Awarded Merit Scholarship for three consecutive years at Thapar Institute for ranking among the top students in the Computer Science program based on academic performance.',
    year: '2023–2026',
    icon: 'trophy',
  },
  {
    title: 'CGPA 9.55 / 10',
    description:
      'Maintaining a 9.55 CGPA out of 10 in B.Tech Computer Science Engineering at Thapar Institute of Engineering and Technology.',
    year: '2023–Present',
    icon: 'star',
  },
  {
    title: 'ML Specialization — Stanford & DeepLearning.AI',
    description:
      'Completed the Machine Learning Specialization by Stanford University and DeepLearning.AI, taught by Andrew Ng. Covers supervised learning, unsupervised learning, and best practices.',
    year: '2024',
    icon: 'certificate',
  },
  {
    title: 'Aditya-L1 Space Research',
    description:
      'Developed a physics-informed ML system for detecting Halo Coronal Mass Ejections using real solar wind plasma data from ISRO\'s Aditya-L1 spacecraft SWIS instrument, achieving 100% CME recall.',
    year: '2024',
    icon: 'rocket',
  },
]

export const stats = [
  { label: 'CGPA', value: '9.55', suffix: '/ 10' },
  { label: 'Projects Built', value: '19', suffix: '+' },
  { label: 'Scholarships', value: '3', suffix: 'x Merit' },
  { label: 'Class 12', value: '96.7', suffix: '%' },
]
