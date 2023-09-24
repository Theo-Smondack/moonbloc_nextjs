import styles from './pagination.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { PaginationProps } from '../../types/props';


const Pagination = ({ currentPage,pageCallback,totalPages }:PaginationProps) => {
    const [pageIndex, setPageIndex] = useState<number>(currentPage)
    useEffect(() => {
        setPageIndex(currentPage)
    }, [currentPage])

    const switchPage = (value: number): void => {
        if (value >= 1 && value <= totalPages) {
            setPageIndex(value)
            pageCallback(value);
        }
    }
    let pages: any[] = Array.from({ length: 6 }, (_, x) => x + 1);

    if (totalPages > 8) {
        pages.push(...['...', totalPages])
        if (currentPage >= 5) {
            pages = [1, '...']
            pages.push(...Array.from({ length: 5 }, (_, x) => x + currentPage - 2));
            pages.push(...['...', totalPages])
        }

        if (currentPage >= totalPages - 3) {
            pages = [1, '...']
            pages.push(...Array.from({ length: 6 }, (_, x) => x + totalPages - 5));
        }

        if (currentPage >= totalPages) {
            pages = [1, '...']
            pages.push(...Array.from({ length: 6 }, (_, x) => x + currentPage - 5));
        }
    }else if (totalPages < 8 && totalPages > 1) {
        pages = Array.from({ length: totalPages }, (_, x) => x + 1);
    }



    return (
        <div className={styles.paginationContainer}>
            <div className={styles.pagination}>
                <div className={styles.pagination}>
                    <ul>
                        <li className={styles.arrowLi}><FontAwesomeIcon icon={faAngleLeft}
                                                                        style={{ fontSize: 21 }}
                                                                        onClick={() => switchPage(pageIndex - 1)}/>
                        </li>
                        {
                            pages.map((page, index: number) => {
                                let _className: string = styles.pageNumber;
                                if (page === pageIndex) {
                                    _className = `${styles.pageNumber} ${styles.active}`
                                }
                                if (typeof page == 'number') {
                                    return (
                                        <li key={index} className={_className}
                                            onClick={() => switchPage(page)}>{page}</li>
                                    )
                                } else {
                                    return (
                                        <li key={index}>{page}</li>
                                    )
                                }


                            })
                        }

                        <li className={styles.arrowLi}><FontAwesomeIcon icon={faAngleRight}
                                                                        style={{ fontSize: 21 }}
                                                                        onClick={() => switchPage(pageIndex + 1)}/></li>
                    </ul>

                </div>
            </div>
        </div>
    )

}

export default Pagination;