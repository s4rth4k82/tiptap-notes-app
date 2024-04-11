import { useState } from "react"
import Tiptap from "../Tiptap"

const NewNote = () => {
  const [htmlContent, setHtmlContent] = useState("")

  const handleEditorContentSave = (html) => {
    setHtmlContent(html)
    console.log(htmlContent)
  }
  return (
    <>
      <Tiptap onEditorContentSave={handleEditorContentSave} />
    </>
  )
}

export default NewNote
