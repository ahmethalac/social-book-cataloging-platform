import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Cookies from 'universal-cookie';
import { AppBar, Toolbar, makeStyles, styled, Button, Container, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { SET_HOME_CONTENT } from '../../actions';
import HomePage from '../HomePage/HomePage';
import BookListContainer from '../BookList/BookListContainer';
import ChallengeListContainer from '../ChallengeList/ChallengeListContainer';
import BooksContainer from '../Books/BooksContainer';
import Logo from '../../assets/logo.png';

const useStyles = makeStyles((theme) => ({
    navBar: {
        backgroundColor: '#F4F1EA',
        boxSizing: 'border-box',
        minHeight: '50px',
        padding: '0'
    },
    accountBox: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        color: '#706E6B',
        fontSize: '20px',
        fontWeight: 'bold'
    },
    logo: {
        width: '200px',
        height: '50px',
        backgroundImage: `url(${Logo})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
    }
}));

const NavButton = styled(Button)({
    display: 'flex',
    alignItems: 'center',
    height: '50px',
    padding: '0 20px',
    color: '#382110',
    fontSize: '20px',
    fontWeight: '500',
    textTransform: 'none',
    borderRadius: '0',
    cursor: 'pointer',
    '&:hover': {
        color: 'white',
        backgroundColor: '#382110'
    }
})

export default function Home() {
    const dispatch = useDispatch();
    const classes = useStyles();
    const name = useSelector(state => state.username);
    const homeContent = useSelector(state => state.homeContent) || { mode: 'home'};

    const handleLogout = () => {
        const cookies = new Cookies();
        cookies.remove('username');
        window.location.reload();
    }

    const setHomeContent = mode => () => {
        dispatch({
            type: SET_HOME_CONTENT,
            payload: { mode }
        })
    }

    let MainComponent = Container;
    switch (homeContent.mode) {
        case 'home':
            MainComponent = HomePage;
            break;
        case 'books':
            MainComponent = BooksContainer;
            break;
        case 'challenges':
            MainComponent = ChallengeListContainer;
            break;
        case 'booklists':
            MainComponent = BookListContainer;
            break;
        default:
            MainComponent = Container;
    }

    return (
        <div>
            <AppBar position="sticky">
                <Toolbar className={classes.navBar}>
                    <div className={classes.logo}/>
                    <NavButton onClick={setHomeContent('home')}>
                        Home
                    </NavButton>
                    <NavButton onClick={setHomeContent('books')}>
                        Books
                    </NavButton>
                    <NavButton onClick={setHomeContent('challenges')}>
                        Challenges
                    </NavButton>
                    <NavButton onClick={setHomeContent('booklists')}>
                        My Lists
                    </NavButton>
                    <div className={classes.accountBox}>
                        <Typography style={{ fontSize: '25px'}}>{name}</Typography>
                        <AccountCircleIcon color="action" fontSize="large" style={{margin: '0 5px'}}/>
                    </div>
                    <NavButton style={{padding: '0 30px'}} onClick={handleLogout}>
                        Logout
                    </NavButton>
                </Toolbar>
            </AppBar>
            <MainComponent/>
        </div>
    )
}
