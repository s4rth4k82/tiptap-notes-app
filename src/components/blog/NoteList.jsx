import PropTypes from "prop-types";
import parse from "html-react-parser"
import axios from 'axios'

const NoteList = ({ notes, allNotes}) => {

    const handleDelete = async (noteId) => {
        try {
          await axios.delete(`http://localhost:5000/api/notes/${noteId}`);
          allNotes();
        } catch (err) {
          console.log(err);
        }
      };

//   const handleEdit = (note) => {
//     // Handle edit functionality here, e.g., pass the note object to a parent component for editing
//     onSelect(note);
//   };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Notes List</h2>
      <ul className="space-y-2">
        {notes.map((note) => (
          <li
            key={note._id}
            className="bg-white shadow-md rounded-lg px-4 py-2 flex items-center justify-between hover:shadow-lg transition duration-300"
          >
            <span className="text-lg">{parse(note.content)}</span>
            <div>
              <button
                // onClick={() => handleEdit(note)}
                className="text-blue-500 font-medium mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="text-red-500 font-medium"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

NoteList.propTypes = {
  notes: PropTypes.func.isRequired,
  allNotes: PropTypes.func.isRequired,
};

export default NoteList;
