import UserRow from "./UserRow";
import "./UsersTable.css";

export default function({users, handleSelectAll, isHeaderChecked, isRowChecked, handleRowCheck, handleRowDelete, handleUpdateRowData, currentPage}) {
	const rows = [];

	users.forEach(user => {
		rows.push(
			<UserRow 
				user={user}
				isRowChecked={isRowChecked}
				handleRowCheck={handleRowCheck}
				handleRowDelete={handleRowDelete}
				handleUpdateRowData={handleUpdateRowData}
				key={user.id} 
			/>
		);
	});

	return (
		<table border="0" className="users-table">
			<thead>
				<tr>
					<th>
						<label>
							<input type="checkbox" checked={isHeaderChecked[currentPage] || false} onChange={(ev) => handleSelectAll(ev, currentPage)} />
						</label>
					</th>
					<th>Name</th>
					<th>Email</th>
					<th>Role</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>{rows.length !== 0 ? rows : (<tr><td colSpan="5">No matching data found</td></tr>)}</tbody>	
		</table>
	);
}