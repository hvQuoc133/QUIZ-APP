import './TableQuiz.scss';

const TableQuiz = (props) => {

    const { listQuiz, handleUpdateQuiz, handleDeleteQuiz } = props;

    return (
        <table className="table table-bordered table-list-quiz">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Type</th>
                    <th scope="col">Action</th>
                </tr>
            </thead>
            <tbody className="content-quiz">
                {listQuiz && listQuiz.map((item, index) => {
                    return (
                        <tr key={`table-quiz-${index}`}>
                            <th>{item.id}</th>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.difficulty}</td>
                            <td className='action-btn'>
                                <button onClick={() => handleUpdateQuiz(item)} className="btn btn-primary">Update</button>
                                <button onClick={() => handleDeleteQuiz(item)} className="btn btn-danger">Delete</button>
                            </td>
                        </tr>
                    )
                })}

            </tbody>
        </table>
    )

}

export default TableQuiz;
