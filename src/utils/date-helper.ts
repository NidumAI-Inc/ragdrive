import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

export function relativeDateFormat(date: string) {
  const now = dayjs()
  const chatDate = dayjs(date)
  const diffDays = now.diff(chatDate, 'day')
  const diffMonths = now.diff(chatDate, 'month')

  if (!now.isSame(chatDate, "year")) return chatDate.format('MMM YY')
  if (diffMonths > 0) return chatDate.format('MMM')

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

// export const generateSampleChats = (count: number = 100) => {
//   const chats = [];
//   const today = dayjs();

//   for (let i = 0; i < count; i++) {
//     let chatDate;

//     if (i < 7) {
//       // First week: one chat per day
//       chatDate = today.subtract(i, 'day');
//     } else if (i < 14) {
//       // Second week: one chat every other day
//       chatDate = today.subtract(7 + (i - 7) * 2, 'day');
//     } else if (i < 30) {
//       // Rest of the first month: one chat every 3 days
//       chatDate = today.subtract(14 + (i - 14) * 3, 'day');
//     } else {
//       // Previous months: one chat every week
//       chatDate = today.subtract(44 + (i - 30) * 7, 'day');
//     }

//     chats.push({
//       id: `chat-${i + 1}`,
//       title: `Chat from ${chatDate.format('MMMM D, YYYY')}`,
//       at: chatDate.toISOString()
//     });
//   }

//   return chats.sort((a, b) => dayjs(b.at).diff(dayjs(a.at)));
// }


// export const generateSampleProjects = (count: number = 100) => {
//   const projects = [];
//   const today = dayjs();

//   for (let i = 0; i < count; i++) {
//     let projectDate;

//     if (i < 7) {
//       // First week: one chat per day
//       projectDate = today.subtract(i, 'day');
//     } else if (i < 14) {
//       // Second week: one chat every other day
//       projectDate = today.subtract(7 + (i - 7) * 2, 'day');
//     } else if (i < 30) {
//       // Rest of the first month: one chat every 3 days
//       projectDate = today.subtract(14 + (i - 14) * 3, 'day');
//     } else {
//       // Previous months: one chat every week
//       projectDate = today.subtract(44 + (i - 30) * 7, 'day');
//     }

//     projects.push({
//       id: `project-${i + 1}`,
//       name: `Project from ${projectDate.format('MMMM D, YYYY')}`,
//       other: "",
//       category: "General",
//       description: "This is a default project",
//       systemPrompt: "You are a helpful assistant.",
//       tokenLimit: 8000,
//       frequency_penalty: 0,
//       temperature: 0.1,
//       max_tokens: 500,
//       top_p: 1,
//       n: 1,
//       web_enabled: false,
//       rag_enabled: false,
//       at: projectDate.toISOString()
//     });
//   }

//   return projects.sort((a, b) => dayjs(b.at).diff(dayjs(a.at)));
// }

