import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type RedirectProps = {
    to: string
}

export default function Redirect(props: RedirectProps): React.ReactElement | null {
    const { to } = props;
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    });
    return null;
};