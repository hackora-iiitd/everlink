/** Invented sample people for the preview build. Every list rendered from here is labelled "Sample" in the UI. */

export const sampleStudents = [
  { id: 's1', name: 'Aarohi S.', year: '3rd year', dept: 'Computer Science', skills: ['Python', 'Machine Learning'], interests: ['Healthcare AI', 'Research'], why: 'Python and ML skills match your healthcare AI project.' },
  { id: 's2', name: 'Meher K.', year: '4th year', dept: 'Electronics & Communication', skills: ['Signal Processing', 'MATLAB'], interests: ['Biomedical signals'], why: 'Signal processing background fits the ECG study.' },
  { id: 's3', name: 'Tanvi R.', year: '2nd year', dept: 'Information Technology', skills: ['React', 'SQL'], interests: ['Startups', 'Open Source'], why: 'Interested in startups and wants a first mentor in product.' },
  { id: 's4', name: 'Ishita M.', year: '3rd year', dept: 'Computer Science', skills: ['Java', 'Data Analysis'], interests: ['Cybersecurity'], why: 'Asked for guidance on breaking into security roles.' },
]

export const sampleApplicants = [
  { id: 'a1', name: 'Aarohi S.', dept: 'Computer Science · 3rd year', projectKey: 0, note: 'Built a small ECG classifier for a course project.', status: 'new' as const },
  { id: 'a2', name: 'Meher K.', dept: 'ECE · 4th year', projectKey: 0, note: 'Has worked with MATLAB on biomedical datasets.', status: 'new' as const },
  { id: 'a3', name: 'Riya P.', dept: 'IT · 2nd year', projectKey: 1, note: 'Keen to learn; has completed an intro ML course.', status: 'shortlisted' as const },
]

export type ReqStatus = 'pending' | 'accepted' | 'declined'
export const sampleMentorRequests = [
  { id: 'm1', from: 'Aarohi S.', meta: 'Computer Science · 3rd year', message: 'I would like guidance on getting my first data science internship. Could we talk once a month?', status: 'pending' as ReqStatus },
  { id: 'm2', from: 'Tanvi R.', meta: 'Information Technology · 2nd year', message: 'I am trying to decide between product and engineering. Could you share how you chose?', status: 'pending' as ReqStatus },
  { id: 'm3', from: 'Ishita M.', meta: 'Computer Science · 3rd year', message: 'Would you review my resume before placement season?', status: 'pending' as ReqStatus },
]

export const sampleAlumniPeers = [
  { id: 'p1', name: 'Neha G.', year: 2016, industry: 'Data & AI', role: 'Senior Data Scientist', org: 'Sample Analytics Co.' },
  { id: 'p2', name: 'Kriti B.', year: 2018, industry: 'Software & IT', role: 'Engineering Manager', org: 'Sample Software Ltd.' },
  { id: 'p3', name: 'Sanya V.', year: 2016, industry: 'Healthcare', role: 'Clinical Data Lead', org: 'Sample Health Systems' },
  { id: 'p4', name: 'Pooja A.', year: 2020, industry: 'Product & Startups', role: 'Founder', org: 'Sample Ventures' },
  { id: 'p5', name: 'Divya L.', year: 2014, industry: 'Research & Academia', role: 'Research Fellow', org: 'Sample Institute' },
]

export const sampleFaculty = [
  { id: 'f1', name: 'Prof. A. Sharma', dept: 'Computer Science', topics: ['Computer Vision', 'Healthcare AI'], kind: 'Faculty' },
  { id: 'f2', name: 'Dr. R. Menon', dept: 'Electronics & Communication', topics: ['Signal Processing', 'VLSI'], kind: 'Faculty' },
  { id: 'f3', name: 'Neha G.', dept: 'Alumna · Data & AI', topics: ['Applied ML', 'Healthcare data'], kind: 'Alumna' },
  { id: 'f4', name: 'Sanya V.', dept: 'Alumna · Healthcare', topics: ['Clinical datasets', 'Evaluation'], kind: 'Alumna' },
]

export const sampleEvents = [
  { id: 'e1', title: 'Alumni–student career evening', when: 'Date to be announced', where: 'Campus, IGDTUW', kind: 'Event' },
  { id: 'e2', title: 'Batch reunion planning call', when: 'Date to be announced', where: 'Online', kind: 'Reunion' },
  { id: 'e3', title: 'Mock interview weekend', when: 'Date to be announced', where: 'Online', kind: 'Event' },
]
