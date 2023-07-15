import { useState } from "react";

export default function UserRow({user, isRowChecked, handleRowCheck, handleRowDelete, handleUpdateRowData}){

	const [ isEditable, setIsEditable] = useState(false);
	const [rowData, setRowData] = useState(user);

	const handleRowEdit = () => {
		setIsEditable(true);
	}

	const handleInput = (ev) => {
		setRowData((prevData) => ({
			...prevData,
			[ev.target.name]: ev.target.value
		}))
	}

	const handleSaveClick = () => {
		handleUpdateRowData(rowData)
		setIsEditable(false);
	}

	return (
		<tr className={isRowChecked[user.id] ? "row-select" : ""}>
			<td>
				<label>
					<input 
						type="checkbox"
						checked={isRowChecked[user.id] || false} 
						onChange={() => handleRowCheck(user.id)} 
					/>
				</label>
			</td>
			{isEditable ? (
				<>
					<td>
						<input 
							type="text"
							name="name" 
							value={rowData.name}
							onChange={handleInput}
						/>
					</td>
					<td>
						<input 
							type="email"
							name="email"
							value={rowData.email}
							onChange={handleInput}
						/>
					</td>
					<td>
						<select name="role" value={rowData.role} onChange={handleInput}>
							<option value="admin">admin</option>
							<option value="member">member</option>
						</select>
					</td>
					<td>
						<button onClick={handleSaveClick}>
							<span role="img" aria-label="Save">&#128190;</span>
						</button>
						<button onClick={() => setIsEditable(false)}>
							<span role="img" aria-label="Cancel">&#10006;</span>
						</button>
					</td>
				</>
			) 
			: (
			<>
				<td>{user.name}</td>
				<td>{user.email}</td>
				<td>{user.role}</td>
				<td>
					<button onClick={(ev) => handleRowEdit(user.id)}>
						<span role="img" aria-label="Edit">&#9998;</span>
					</button>
					<button onClick={(ev) => handleRowDelete(user.id)}>
						<span role="img" aria-label="Delete">&#128465;</span>
					</button>
				</td>
			</>
			)}
		</tr>		
	);
}