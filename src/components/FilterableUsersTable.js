import { useEffect, useState } from "react";
import UsersTable from "./UsersTable";
import { config } from "../App";
import "./FilterableUsersTable.css";
import TableFooter from "./TableFooter";

export default function FilterableUsersTable() {

	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([])
	const [searchText, setSearchText] = useState("");
	const [isHeaderChecked, setIsHeaderChecked] = useState({});
	const [isRowChecked,setIsRowChecked] = useState({});
	const [currentPage, setCurrentPage] = useState(1);
	const [totalUsers, setTotalUsers] = useState(0);
	const itemsPerPage = config.itemsPerPage;

	const getUsers = async() => {
		try{
			const response = await fetch(config.endpoint);
			const apiUsers = await response.json();
			setUsers(apiUsers);
			setFilteredUsers(apiUsers.slice(0,10))
			setTotalUsers(apiUsers.length);
			// console.log(apiUsers);
		}
		catch(err){
			alert(err.response.data);
			setFilteredUsers([]);
			setTotalUsers(0);
		}
	}

	useEffect(() => {
		getUsers();
	},[]);

	const getFilteredUsers = (users, searchText) => {
		const matchedUsers = users.filter((user) => {
			return (user.name.toLowerCase().includes(searchText.toLowerCase()) || 
							user.email.toLowerCase().includes(searchText.toLowerCase) || 
							user.role.toLowerCase().includes(searchText.toLowerCase()))
		})
		return matchedUsers;
	}

	const handleInput = (ev) => {
		setSearchText(ev.target.value);
		const matchedUsers = getFilteredUsers(users, ev.target.value);
		setTotalUsers(matchedUsers.length);
		setFilteredUsers(matchedUsers.slice(0,10));
		setCurrentPage(1);
	}

	const handleCheck = (ev, pageNum) => {
		setIsHeaderChecked((prevHeader) => ({
			...prevHeader,
			[pageNum]: ev.target.checked
		}))
		const rowCheckBoxStatus = {}
		for(let user of filteredUsers)
			rowCheckBoxStatus[user.id] = ev.target.checked
		
		setIsRowChecked(rowCheckBoxStatus);
	}

	const handleRowCheck = (userId) => {
		setIsRowChecked((prevCheck) => ({
			...prevCheck,
			[userId]: !prevCheck[userId]
		}))
	}

	const handleRowDelete = (userId) => {
		userId = typeof(userId) == "string" ? [userId] : userId;
		const updatedUsers = users.filter(user => !(userId.includes(user.id)));
		setUsers(updatedUsers);
		setTotalUsers(updatedUsers.length);
		let updatedPage = currentPage;
		// if we delete rows in last page, then we have to update current page to its before page.
		if(currentPage > Math.ceil(updatedUsers.length/config.itemsPerPage)) {
			updatedPage = currentPage - 1
		}
		setCurrentPage(updatedPage);
		const [firstIdx, lastIdx] = getPageIndexes(updatedPage);
		setFilteredUsers(updatedUsers.slice(firstIdx, lastIdx));
		setIsHeaderChecked((prevHeader) => ({
			...prevHeader,
			[currentPage]: false
		}))
	}

	const getPageIndexes = (pageNum) => {
		const firstIdx = (pageNum * itemsPerPage - itemsPerPage)
		const lastIdx = pageNum * itemsPerPage;
		return [firstIdx, lastIdx]
	} 

	const handleUpdateRowData = (userData) => {
		const updatedRowData = users.map((user) => {
			if(user.id === userData.id) {
				return userData
			} else {
				return user
			}
		})
		setUsers(updatedRowData);
		const [firstIdx, lastIdx] = getPageIndexes(currentPage)
		setFilteredUsers(updatedRowData.slice(firstIdx, lastIdx));
	}

	const handleDeleteClick = () => {
		const rowIds = new Array();
		for(const rowId in isRowChecked){
			if(isRowChecked[rowId])
				rowIds.push(rowId)
		}
		handleRowDelete(rowIds)
	}

	const handlePagination = (pageNum) => {
		const [firstIdx, lastIdx] = getPageIndexes(pageNum)
		let matchedUsers = users;
		setCurrentPage(pageNum);
		if(searchText !== ""){
			matchedUsers = getFilteredUsers(users, searchText)
		}
		setFilteredUsers(matchedUsers.slice(firstIdx, lastIdx));
	}

	return (
		<div className="admin-users">
			<input type="text" name="search" className="search-box" placeholder="Search by name, email or role" onChange={handleInput} />
			<UsersTable
				users={filteredUsers}
				handleCheck={handleCheck}
				isHeaderChecked={isHeaderChecked}
				isRowChecked={isRowChecked} 
				handleRowCheck={handleRowCheck}
				handleRowDelete={handleRowDelete}
				handleUpdateRowData={handleUpdateRowData}
				currentPage={currentPage}
			/>
			<TableFooter 
				totalUsers={totalUsers} 
				currentPage={currentPage} 
				handleDeleteClick={handleDeleteClick} 
				handlePagination={handlePagination}
			/>
		</div>
	);
}