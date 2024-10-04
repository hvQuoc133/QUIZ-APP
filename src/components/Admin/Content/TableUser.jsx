import './Scss/TableUser.scss';

const TableUser = (props) => {

    const { listUsers } = props;

    return (
        <>
            <table className="table table-bordered table-list-user">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Username</th>
                        <th scope="col">Email</th>
                        <th scope="col">Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody className="content-user">
                    {listUsers && listUsers.length > 0 && listUsers
                        .sort((a, b) => a.id - b.id)
                        .map((item, index) => {
                            return (
                                <tr key={`table-user-${index}`}>
                                    <th scope="row">{item.id}</th>
                                    <td>{item.username}</td>
                                    <td>{item.email}</td>
                                    <td>@{item.role}</td>
                                    <td className="action-btn">
                                        <button onClick={() => props.handleClickBtnView(item)} className="btn btn-info">View</button>
                                        <button onClick={() => props.handleClickBtnUpdate(item)} className="btn btn-primary mx-10">Update</button>
                                        <button onClick={() => props.handleClickBtnDelete(item)} className="btn btn-danger">Delete</button>
                                    </td>
                                </tr>
                            )
                        })}
                    {listUsers && listUsers.length === 0 &&
                        <tr>
                            <td colSpan={4}>Not found data</td>
                        </tr>
                    }
                </tbody>
            </table>
        </>
    )
}

export default TableUser;