import UserType from "./UserType"

export interface MediaType {
  type: "image" | "video" | "file" | "gif" | "audio"
  url: string
  size?: string
  name?: string
}

type MessageType = {
  user: UserType
  id?: string
  text?: string
  media?: MediaType
  createdAt?: Date
  seen?: boolean
  loading?: boolean
  failed?: boolean
  debugInfo?: object
}

export default MessageType