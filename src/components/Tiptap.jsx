import { useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import axios from "axios";
import {
  FaImage,
  FaAlignCenter,
  FaAlignLeft,
  FaAlignRight,
  FaAlignJustify,
  FaLink,
  FaHighlighter,
  FaItalic,
  FaUnderline,
  FaCode,
  FaListOl,
  FaListUl,
  FaRulerHorizontal,
  FaFont,
  FaParagraph,
  FaTerminal,
  FaQuoteLeft,
  FaUndo,
  FaRedo,
  FaHeading,
} from "react-icons/fa";
import NoteList from "./blog/NoteList";

// tiptap extensions
const extensions = [
  StarterKit,
  Underline,
  FontFamily,
  TextStyle,
  Highlight,
  Link,
  Subscript,
  Superscript,
  Image,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Placeholder.configure({
    placeholder: "Write something...",
  }),
];

const content = ``;

const Tiptap = ({ onEditorContentSave }) => {
  const editor = useEditor({
    extensions,
    content,
  });
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    allNotes();
  }, []);
  const allNotes = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/notes");
      console.log("ALL", res.data);
      setNotes(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const addImage = () => {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  // const handleEditorContent = () => {
  //   const html = editor.getHTML();
  //   // console.log(html)
  //   onEditorContentSave(html);
  // };

  const saveContent = async () => {
    try {
      const html = editor.getHTML();
      // console.log(html)
      onEditorContentSave(html);
      const response = await axios.post("http://localhost:5000/api/notes", {
        content: html,
      });
      await allNotes();
      console.log("Post created:", response.data);
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error
    }
  };

  return (
    <>
      {/* title */}
      <h1 className="my-4 text-2xl font-bold text-center text-slate-600">
        Notes App
      </h1>

      {/* container */}
      <div className="w-[70%] m-8 mx-auto">
        {/* toolbar */}
        <div className="flex flex-wrap justify-center w-full rounded-b-none join bg-neutral">
          {/* undo button */}
          <button
            className="text-white rounded-none btn btn-neutral join-item"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <FaUndo />
          </button>

          {/* redo button */}
          <button
            className="text-white rounded-none btn btn-neutral join-item"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <FaRedo />
          </button>

          {/* Bold button */}
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`btn btn-neutral join-item rounded-none text-white ${
              editor.isActive("bold") ? "is-active" : ""
            }`}
          >
            <strong className="text-xl">B</strong>
          </button>

          {/* Image button */}
          <button
            className="text-lg text-white rounded-none btn btn-neutral join-item"
            onClick={addImage}
          >
            <FaImage />
          </button>

          {/* Dropdown for align text */}
          <div className="dropdown join-item">
            <div
              tabIndex={0}
              role="button"
              className="text-white rounded-none btn btn-neutral join-item"
            >
              <FaAlignLeft />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu rounded-none shadow bg-neutral-800 text-white w-28 join-item"
            >
              {/* left */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={` ${
                    editor.isActive({ textAlign: "left" }) ? "is-active" : ""
                  }`}
                >
                  <FaAlignLeft /> Left
                </button>
              </li>

              {/* center */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={`
            ${editor.isActive({ textAlign: "center" }) ? "is-active" : ""}`}
                >
                  <FaAlignCenter /> Center
                </button>
              </li>

              {/* right */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" }) ? "is-active" : ""
                  }
                >
                  <FaAlignRight /> Right
                </button>
              </li>

              {/* justify */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={
                    editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
                  }
                >
                  <FaAlignJustify /> Justify
                </button>
              </li>
            </ul>
          </div>

          {/* Dropdown for heading */}
          <div className="dropdown join-item">
            <div
              tabIndex={0}
              role="button"
              className="text-white rounded-none btn btn-neutral join-item"
            >
              <FaHeading />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu shadow bg-neutral-800 text-white w-48 join-item rounded-none"
            >
              {/* Heading 1 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 1 }) ? "is-active" : ""
                  }
                >
                  <h1 className="text-3xl">Heading 1</h1>
                </button>
              </li>

              {/* Heading 2 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 2 }) ? "is-active" : ""
                  }
                >
                  <h2 className="text-2xl">Heading 2</h2>
                </button>
              </li>

              {/* Heading 3 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 3 }) ? "is-active" : ""
                  }
                >
                  <h2 className="text-xl">Heading 3</h2>
                </button>
              </li>

              {/* Heading 4 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 4 }) ? "is-active" : ""
                  }
                >
                  <h2 className="text-lg">Heading 4</h2>
                </button>
              </li>

              {/* Heading 5 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 5 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 5 }) ? "is-active" : ""
                  }
                >
                  <h2 className="text-md">Heading 5</h2>
                </button>
              </li>

              {/* Heading 6 */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 6 }).run()
                  }
                  className={
                    editor.isActive("heading", { level: 6 }) ? "is-active" : ""
                  }
                >
                  <h2 className="text-xs">Heading 6</h2>
                </button>
              </li>
            </ul>
          </div>

          {/* Dropdown for font family */}
          <div className="rounded-none dropdown join-item">
            <div
              tabIndex={0}
              role="button"
              className="text-white btn btn-neutral join-item"
            >
              <FaFont />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu shadow bg-neutral-800 w-40 text-white"
            >
              {/* Inter font */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setFontFamily("Inter").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "Inter" })
                      ? "is-active"
                      : ""
                  }
                >
                  <p className="font-[inter]">Inter</p>
                </button>
              </li>

              {/* Comic Sans font */}
              <li>
                <button
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .setFontFamily("Comic Sans MS, Comic Sans")
                      .run()
                  }
                  className={
                    editor.isActive("textStyle", {
                      fontFamily: "Comic Sans MS, Comic Sans",
                    })
                      ? "is-active"
                      : ""
                  }
                >
                  <p className="font-sans">Comic Sans</p>
                </button>
              </li>

              {/* serif font */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setFontFamily("serif").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "serif" })
                      ? "is-active"
                      : ""
                  }
                >
                  <p className="font-serif">serif</p>
                </button>
              </li>

              {/* monospace font */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setFontFamily("monospace").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "monospace" })
                      ? "is-active"
                      : ""
                  }
                >
                  <p className="font-mono">monospace</p>
                </button>
              </li>

              {/* cursive font */}
              <li>
                <button
                  onClick={() =>
                    editor.chain().focus().setFontFamily("cursive").run()
                  }
                  className={
                    editor.isActive("textStyle", { fontFamily: "cursive" })
                      ? "is-active"
                      : ""
                  }
                >
                  <p className="font-[cursive]">cursive</p>
                </button>
              </li>
            </ul>
          </div>

          {/* subscript button */}
          <button
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("subscript") ? "is-active" : ""
            }`}
          >
            <p>
              x<sub>2</sub>
            </p>
          </button>

          {/* superscript button */}
          <button
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("superscript") ? "is-active" : ""
            }`}
          >
            <p>
              x<sup>2</sup>
            </p>
          </button>

          {/* link button */}
          <button
            onClick={setLink}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("link") ? "is-active" : ""
            }`}
          >
            <FaLink />
          </button>

          {/* Highlighter button */}
          <button
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("highlight") ? "is-active" : ""
            }`}
          >
            <FaHighlighter />
          </button>

          {/* italic button */}
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`btn btn-neutral join-item text-white text-xl rounded-none ${
              editor.isActive("italic") ? "is-active" : ""
            }`}
          >
            <FaItalic />
          </button>

          {/* underline button */}
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("underline") ? "is-active" : ""
            }`}
          >
            <FaUnderline />
          </button>

          {/* Paragraph button */}
          <button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`btn btn-neutral join-item text-white text-xl rounded-none ${
              editor.isActive("paragraph") ? "is-active" : ""
            }`}
          >
            <FaParagraph />
          </button>

          {/* strick through button */}
          <button
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
            className={`btn btn-neutral join-item text-white text-xl rounded-none ${
              editor.isActive("strike") ? "is-active" : ""
            }`}
          >
            <s>S</s>
          </button>

          {/* code button */}
          <button
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
            className={`btn btn-neutral join-item text-white text-xl rounded-none ${
              editor.isActive("code") ? "is-active" : ""
            }`}
          >
            <FaCode />
          </button>

          {/* codeblock button */}
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`btn btn-neutral join-item text-white rounded-none ${
              editor.isActive("codeBlock") ? "is-active" : ""
            }`}
          >
            <FaTerminal />
          </button>

          {/* Ol list button */}
          <button
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("orderedList") ? "is-active" : ""
            }`}
          >
            <FaListOl />
          </button>

          {/* Ul list button */}
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`btn btn-neutral join-item text-white text-lg rounded-none ${
              editor.isActive("bulletList") ? "is-active" : ""
            }`}
          >
            <FaListUl />
          </button>

          {/* block quote button */}
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`btn btn-neutral join-item text-white rounded-none ${
              editor.isActive("blockquote") ? "is-active" : ""
            }`}
          >
            <FaQuoteLeft />
          </button>

          {/* Hr button */}
          <button
            className="text-lg text-white rounded-none btn btn-neutral join-item"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <FaRulerHorizontal />
          </button>

          {/* hard break button */}
          <button
            className="text-white rounded-none btn btn-neutral join-item"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            Hard break
          </button>
        </div>

        {/* Editor content */}
        <div className="border-2 border-black rounded-b-xl">
          <EditorContent editor={editor} className="" />
        </div>

        {/* Save button */}
        <button
          className="mt-5 text-white btn btn-neutral"
          onClick={saveContent}
        >
          SAVE
        </button>
      </div>
      <NoteList notes={notes} allNotes={allNotes} />
    </>
  );
};

Tiptap.propTypes = {
  onEditorContentSave: PropTypes.func,
};

export default Tiptap;
