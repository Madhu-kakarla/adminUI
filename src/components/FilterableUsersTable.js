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

	const handleSelectAll = (ev, pageNum) => {
		setIsHeaderChecked((prevHeader) => ({
			...prevHeader,
			[pageNum]: ev.target.checked
		}))
		const rowCheckBoxStatus = {}
		for(let user of filteredUsers)
			rowCheckBoxStatus[user.id] = ev.target.checked
		
		setIsRowChecked(rowCheckBoxStatus);
	}

	const handleRowCheck = (ev, userId) => {
		setIsRowChecked((prevCheck) => ({
			...prevCheck,
			[userId]: ev.target.checked
		}))
		handlePageSelectAll(ev, userId);
	}

	const handleRowDelete = (userId) => {
		userId = typeof(userId) == "string" ? [userId] : userId;
		const updatedUsers = users.filter(user => !(userId.includes(user.id)));
		setUsers(updatedUsers);
		setTotalUsers(updatedUsers.length);
		let updatedPage = currentPage;
		// if we delete rows in last page, then we have to update current page to its before page.
		if(currentPage > Math.ceil(updatedUsers.length/itemsPerPage)) {
			updatedPage = currentPage - 1
		}
		clearCheckonPageChange(currentPage);
		setCurrentPage(updatedPage);
		const [firstIdx, lastIdx] = getPageIndexes(updatedPage);
		setFilteredUsers(updatedUsers.slice(firstIdx, lastIdx));
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
		clearCheckonPageChange(currentPage);
	}

	const clearCheckonPageChange = (pageNum) => {
		updateSelectAll(pageNum, false);
		const rowCheckBoxStatus = {}
		for(let user of filteredUsers)
			rowCheckBoxStatus[user.id] = false
		
		setIsRowChecked(rowCheckBoxStatus);
	}

	// Handle select All button based on the status of each check button in table row
	const handlePageSelectAll = (ev, userId) => {
		const rowChecks = new Array();
		for(const check in isRowChecked){
			if(userId === check){
				rowChecks.push(ev.target.checked)
			} else {
				rowChecks.push(isRowChecked[check])
			}
		}
		if(rowChecks.includes(false)){
			updateSelectAll(currentPage, false);
		} else {
			updateSelectAll(currentPage, true);
		}
	}

	const updateSelectAll = (pageNum, status) => {
		setIsHeaderChecked((prevHeader) => ({
			...prevHeader,
			[pageNum]: status
		}))
	}

	return (
		<div className="admin-users">
			<input type="text" name="search" className="search-box" placeholder="Search by name, email or role" onChange={handleInput} />
			<UsersTable
				users={filteredUsers}
				handleSelectAll={handleSelectAll}
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