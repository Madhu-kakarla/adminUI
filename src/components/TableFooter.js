import { useState } from "react";
import { config } from "../App";
import "./TableFooter.css";

export default function TableFooter({totalUsers, currentPage, handleDeleteClick, handlePagination}) {

	const lastPage = Math.ceil(totalUsers/config.itemsPerPage)
	const pageNum = currentPage;

	const RenderButtons = () => {
		return (
			<ul>
				{[...Array(lastPage)].map((ele, idx) => {
					return <li key={idx}>
						<button 
							className={currentPage == (idx+1) ? "active" : ""}
							onClick={() => handlePagination(idx+1)}
						>{idx + 1}</button>
					</li>
				})}
			</ul>
		);
	}

  return (
		<div className="table-footer">
			<button type="button" className="delete-button" onClick={handleDeleteClick}>Delete Selected</button>
			<div className="pagination">
				<button disabled={currentPage == 1} onClick={() => handlePagination(1)}>&#171;</button>
				<button disabled={currentPage == 1} onClick={() => handlePagination(pageNum - 1)}>&#60;</button>
				<RenderButtons />
				<button disabled={currentPage == lastPage} onClick={() => handlePagination(pageNum + 1)}>&#62;</button>
				<button disabled={currentPage == lastPage} onClick={() => handlePagination(lastPage)}>&#187;</button>
			</div>
		</div>
	);
}