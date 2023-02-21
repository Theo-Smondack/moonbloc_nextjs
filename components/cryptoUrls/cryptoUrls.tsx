import React from "react";
import {CryptoUrlsProps} from "../../types/props";

const CryptoUrls = ({urls}: CryptoUrlsProps) => {
    return (
        <ul>
            {
                urls.website?.length > 0 &&
                <li>
                    Websites
                    <ul>
                        {
                            urls.website.map((url, index) => <li key={index}><a href={url}>{url}</a></li>)
                        }
                    </ul>
                </li>
            }
            {
                urls.explorer?.length > 0 &&
                <li>
                    Explorer
                    <ul>
                        {
                            urls.explorer.map((url, index) => <li key={index}><a href={url}>{url}</a></li>)
                        }
                    </ul>
                </li>
            }
            {
                urls.source_code?.length > 0 &&
                <li>
                    Source code
                    <ul>
                        {
                            urls.source_code.map((url, index) => <li key={index}><a href={url}>{url}</a></li>)
                        }
                    </ul>
                </li>
            }
            {
                urls.message_board?.length > 0 &&
                <li>
                    Message board
                    <ul>
                        {
                            urls.message_board.map((url, index) => <li key={index}><a href={url}>{url}</a></li>)
                        }
                    </ul>
                </li>
            }
        </ul>
    )

}
export default CryptoUrls;