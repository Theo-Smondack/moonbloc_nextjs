import styles from './cryptotable.module.css';
import React from 'react';

const LoadingCryptotable = () => {
    const rows = [];

    for (let i = 0; i < 20; i++) {
        rows.push(
            <tr key={i}>
                <td colSpan={9} className={'loadingTd'}>
                    <div className={'loadingDiv'}></div>
                </td>
            </tr>
        )
    }
    return (
        <div className='container'>
            <table className={styles.crypto_table}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>1h %</th>
                    <th>24h %</th>
                    <th>7d %</th>
                    <th>Market cap</th>
                    <th>Volume(24h)</th>
                    <th>Circulating Supply</th>
                </tr>
                </thead>
                <tbody>
                {rows}
                </tbody>
            </table>
        </div>
    )

}

export default LoadingCryptotable