import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './Pagination.css';
//Argumet 1 pages which is Total number of pages possible
//Argument 2 currentpage which is selected page right now

//Three Functions
//Hundread Change (when +100 or -100 is clicked)
//Ten Change (When +10 or -10 is clicked)
//nextPage (when from options any page is selected)

const PaginationPage = (props) => {
    const pageLinks = [];
    const {currentPage,pages} = props;
    //Start will point to strating page which is multiple of 10 for current page
    //If currentpage is 18 than it will show 10 to 10+11 pages as link to move
    let start=(currentPage)-(currentPage%10);
    if(start<=0)
        start=1;
    for (let i = start; i <= pages; i++) {
        pageLinks.push(
            <PaginationItem key={i} active={currentPage === i}>
                <PaginationLink key={i} onClick={() => props.nextPage(i)}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        )
    }

    return (
        <Pagination aria-label="Page navigation example" className="pagination mx-auto">
            {pageLinks}
        </Pagination>
    )
}
export default PaginationPage;