import PropTypes from "prop-types"
import parse from "html-react-parser"

const ShowPost = ({ content }) => {
  return (
    // save content
    <div className="tiptap m-4 bg-gray-200 w-[70%] mx-auto">
      <div>{parse(content)}</div>
    </div>
  )
}

ShowPost.propTypes = {
  content: PropTypes.string,
}

export default ShowPost
