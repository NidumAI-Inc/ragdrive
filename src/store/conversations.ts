import { nanoid } from 'nanoid';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import dayjs from 'dayjs';

import { ragDefaultPrompt, systemDefaultPrompt, webDefaultPrompt } from '../utils/improve-context';

export type Message = {
  id: string;
  role: "user" | "assistant" | "loading" | "web-searched"
  content: string;
  images?: string[];
  webSearched?: string[]
}

export type Chat = {
  id: string;
  title: string;
  at: string;
}

export type Project = {
  id: string;
  name: string;
  description: string;
  category: string;
  other: string
  systemPrompt: string;
  webPrompt: string;
  ragPrompt: string;
  frequency_penalty: number;
  temperature: number;
  // tokenLimit: number;
  max_tokens: number;
  top_p: number;
  n: number;
  web_enabled: boolean;
  rag_enabled: boolean;
  at: string;
}

type FileT = {
  id: string;
  name: string;
  size: number;
  type: string;
}

type state = {
  initialised: boolean
  projects: Record<string, Project>; // project_id
  files: Record<string, FileT[]>; // project_id
  chats: Record<string, Chat[]>; // project_id
  messages: Record<string, Message[]>; // chat_id
}

type addProjectType = {
  name: string;
  other: string;
  category: string;
  description: string;
  systemPrompt: string;
}

type actions = {
  init: () => void;
  addProject: (project: addProjectType) => void;
  editProject: (project_id: string, obj: Partial<Project>) => void;
  deleteProject: (project_id: string) => void;

  addChat: (projectId: string, chat: Omit<Chat, "at">) => void;
  editChat: (projectId: string, chat: Partial<Chat>) => void;
  deleteChat: (project_id: string, chat_id: string) => void;

  pushIntoMessages: (project_id: string, chat_id: string, payload: Message | Message[]) => void
  deleteMessage: (chat_id: string, msg_id: string) => void;

  addFile: (projectId: string, file: FileT) => void;
  deleteFile: (project_id: string, file_id: string) => void;

  // addRandomProjects: (chat: Project[]) => void;
  // addRandomChats: (projectId: string, chat: Chat[]) => void;
}

const createDefaultProject = (): [string, Project] => {
  const id = nanoid(10);
  return [id, {
    id,
    name: "Default Project",
    description: "This is a default project",
    category: "General",
    other: "",
    systemPrompt: systemDefaultPrompt,
    webPrompt: webDefaultPrompt,
    ragPrompt: ragDefaultPrompt,
    frequency_penalty: 0,
    temperature: 0.1,
    // tokenLimit: 6000,
    max_tokens: 500,
    top_p: 1,
    n: 1,
    web_enabled: false,
    rag_enabled: false,
    at: dayjs().toISOString(),
  }];
}

const createDefaultChat = (): Chat => ({
  id: nanoid(10),
  title: "Default Chat",
  at: dayjs().toISOString(),
})

const useConvoStore = create<state & actions>()(persist(immer(set => ({
  initialised: false,
  projects: {},
  chats: {},
  messages: {},
  files: {},

  init: () => set(state => {
    if (!state.initialised && Object.keys(state.projects).length === 0) {
      const [defaultProjectId, defaultProject] = createDefaultProject();
      state.projects[defaultProjectId] = defaultProject;

      const defaultChat = createDefaultChat();
      state.chats[defaultProjectId] = [defaultChat];
      state.messages[defaultChat.id] = [];
      state.initialised = true
    }
  }),

  addProject: (project) => set(state => {
    const id = nanoid(10)
    state.projects[id] = {
      id,
      ...project,
      webPrompt: webDefaultPrompt,
      ragPrompt: ragDefaultPrompt,
      // tokenLimit: 6000,
      frequency_penalty: 0,
      temperature: 0.1,
      max_tokens: 500,
      top_p: 1,
      n: 1,
      web_enabled: false,
      rag_enabled: false,
      at: dayjs().toISOString(),
    }

    state.chats[id] = [{
      id: nanoid(10),
      title: "New Chat",
      at: dayjs().toISOString(),
    }]
  }),

  editProject: (project_id, details) => set(state => {
    // @ts-ignore
    state.projects[project_id] = Object.assign(state.projects[project_id], {
      ...details,
      at: dayjs().toISOString(),
    })
  }),

  deleteProject: (project_id) => set(state => {
    const ids = state.chats[project_id]?.map(c => c.id) || []
    ids.forEach(id => {
      delete state.messages[id]
    })
    delete state.chats[project_id]
    delete state.files[project_id]
    delete state.projects[project_id]
  }),

  addChat: (projectId, chat) => set(state => {
    // @ts-ignore
    state.projects[projectId].at = dayjs().toISOString()
    if (!state.chats[projectId]) {
      state.chats[projectId] = []
    }
    // @ts-ignore
    state.chats[projectId].unshift({
      ...chat,
      at: dayjs().toISOString(),
    })
  }),

  editChat: (projectId, chat) => set(state => {
    if (state.chats[projectId]) {
      // @ts-ignore
      state.projects[projectId].at = dayjs().toISOString()
      // @ts-ignore
      const chatIndex = state.chats[projectId].findIndex(c => c.id === chat.id)
      if (chatIndex !== -1) {
        // @ts-ignore
        state.chats[projectId][chatIndex] = Object.assign(state.chats[projectId][chatIndex], {
          ...chat,
          at: dayjs().toISOString(),
        })
      }
    }
  }),

  deleteChat: (project_id, chat_id) => set(state => {
    delete state.messages[chat_id]
    // @ts-ignore
    state.chats[project_id] = state.chats[project_id].filter(c => c.id !== chat_id)
  }),

  pushIntoMessages: (project_id, chat_id, msg) => set(state => {
    if (!state.messages[chat_id]) {
      state.messages[chat_id] = []
    }

    if (Array.isArray(msg)) {
      // @ts-ignore
      state.messages[chat_id].push(...msg)
    } else {
      // @ts-ignore
      state.messages[chat_id].push(msg)
    }

    // @ts-ignore
    state.projects[project_id].at = dayjs().toISOString()
    // @ts-ignore
    let chatIndex = state.chats[project_id].findIndex(c => c.id === chat_id)
    if (chatIndex > -1) {
      // @ts-ignore
      state.chats[project_id][chatIndex].at = dayjs().toISOString()
    }
  }),

  deleteMessage: (chat_id, msg_id) => set(state => {
    // @ts-ignore
    state.messages[chat_id] = state.messages[chat_id].filter(msg => msg.id !== msg_id)
  }),

  addFile: (projectId, file) => set(state => {
    if (!state.files[projectId]) {
      state.files[projectId] = []
    }
    // @ts-ignore
    state.files[projectId].push(file)
  }),

  deleteFile: (project_id, file_id) => set(state => {
    // @ts-ignore
    state.files[project_id] = state.files[project_id].filter(c => c.id !== file_id)
  }),

  // addRandomProjects: (projects) => set(state => {
  //   projects.forEach(pro => {
  //     state.projects[pro.id] = pro
  //   })
  // }),

  // addRandomChats: (project_id, chats) => set(state => {
  //   state.chats[project_id] = chats
  // }),
})),
  {
    name: 'convo-storage',
    version: 1,
    migrate: (persistedState: any, version) => {
      if (version === 0 || !version) {
        Object
          .values(persistedState.projects)
          // @ts-ignore
          .forEach((project: Project) => {
            project.webPrompt = webDefaultPrompt
          })

        return {
          ...persistedState,
        }
      }

      return persistedState
    }
  }
))

export default useConvoStore;