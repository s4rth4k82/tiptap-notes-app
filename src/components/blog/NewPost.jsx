import { useState } from "react"
import Tiptap from "../Tiptap"
import ShowPost from "./ShowPost"
import NoteList from "./NoteList"

const NewPost = () => {
  const [htmlContent, setHtmlContent] = useState("")

  const handleEditorContentSave = (html) => {
    // console.log(html)
    setHtmlContent(html)
  }
  return (
    <>
      <Tiptap onEditorContentSave={handleEditorContentSave} />
    </>
  )
}

export default NewPost
