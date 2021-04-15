import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@material-ui/core/Button';

const Accepted = (props) => {
    const router = useRouter();
    const[data, setData] = useState(props);
    const { value } = data;

    const navigateToDetail = () => {
        if (router.pathname.indexOf('seller') > -1){ 
            router.push(`/seller/seller-detail/${id}`);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center w-100">
            { 
                value ? ( 
                    <Button
                        variant="contained"
                        className="accept"
                        onClick={navigateToDetail}
                    >
                        Đã phê duyệt
                    </Button>
                ) : (
                    <Button
                        variant="contained"
                        className="waitAccept"
                        onClick={navigateToDetail}
                    >
                        Chờ phê duyệt
                    </Button>
                )
            }
        </div>
    )
}

export default Accepted;