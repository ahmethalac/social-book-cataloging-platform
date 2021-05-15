import { call, put, takeEvery } from 'redux-saga/effects';
import { 
    login, 
    signup,
    getAllBooks, 
    getTrackedBooks, 
    getFilteredBooks,
    getReviews,
    getEditions,
    startTracking,
    addReview,
    addProgress,
    getBooksOfAuthor,
    getReviewsForBook,
    getReplies,
    addReply,
    addEdition
} from './api';
import { 
    LOGIN_REQUEST, 
    LOGIN_FAILURE, 
    SIGNUP_REQUEST, 
    SIGNUP_FAILURE,
    SET_HOME_CONTENT, 
    FETCH_BOOKS_REQUEST,
    FETCH_BOOKS_SUCCESS,
    FETCH_BOOKS_FAILURE,
    SET_USERNAME,
    SET_USER_INFORMATION,
    APPLY_FILTERS,
    GET_EDITIONS,
    START_TRACKING,
    START_TRACKING_SUCCESS, 
    ADD_REVIEW,
    ADD_REVIEW_SUCCESS,
    ADD_PROGRESS,
    ADD_PROGRESS_SUCCESS,
    GET_MY_BOOKS,
    GET_MY_BOOKS_SUCCESS,
    GET_REVIEWS_FOR_BOOK,
    ADD_REPLY,
    ADD_REPLY_SUCCESS,
    ADD_EDITION
} from './actions';
import Cookies from 'universal-cookie';

function setCookie(key, value) {
    const cookies = new Cookies();
    cookies.set(key, value, { path: '/' });
}

function* loginMiddleware(action) {
    try {  
        const response = yield call(login, action.payload);
    
        if (response.status === 200) {
            yield put({type: SET_USERNAME, payload: action.payload });
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
            action.history.push('/home');
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: LOGIN_FAILURE, payload: errorMessage });
        action.onError(errorMessage);
    }
}

function* signupMiddleware(action) {
    try {
        const response = yield call(signup, action.payload);

        if (response.status === 200) {
            yield put({type: SET_USERNAME, payload: action.payload});
            yield put({type: SET_HOME_CONTENT, payload: { mode: 'home' }});
            action.history.push('/home');
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: SIGNUP_FAILURE, payload: errorMessage});
        action.onError(errorMessage);
    }
}

function* fetchBook(action) {
    try {
        const response = yield call(getAllBooks);

        if (response.status === 200) {
            yield put({type: FETCH_BOOKS_SUCCESS, payload: response.data});
            action.onSuccess(response.data);
        }
    } catch (error) {
        const errorMessage = error.response.data || error.message;
        yield put({type: FETCH_BOOKS_FAILURE, payload: errorMessage});
        action.onFailure(errorMessage);
    }
}

function* fetchUserInformation(action) {
    const { username, userType } = action.payload;
    yield call(setCookie, 'username', username);
    yield call(setCookie, 'userType', userType);

    let response = yield call(getTrackedBooks, username);

    if (response.status === 200) {
        yield put({
            type: SET_USER_INFORMATION,
            payload: {
                informationType: 'trackedBooks',
                value: response.data
            }
        })
    }

    response = yield call(getReviews, username);

    let newResults = {};
    response.data.forEach(result => {
        newResults[result.bookId] = {
            rate: result.rate,
            comment: result.comment,
            date: result.date
        }
    });

    if (response.status === 200) {
        yield put({
            type: SET_USER_INFORMATION,
            payload: { 
                informationType: 'reviews',
                value: newResults
            }
        })
    }

    if (userType === 'AUTHOR') {
        response = yield call(getReplies, {username});

        yield put({
            type: SET_USER_INFORMATION,
            payload: {
                informationType: 'replies',
                value: response.data
            }
        })
    }
}

function* saveHomeContent(action) {
    yield call(setCookie, 'homeContent', action.payload);
}

function* applyFilters(action) {
    const response = yield call(getFilteredBooks, action.payload);
    yield put({
        type: FETCH_BOOKS_SUCCESS,
        payload: response.data
    })

}

function* getEditionsMiddleware(action) {
    const { bookId, onSuccess } = action.payload;

    const response = yield call(getEditions, bookId);
    onSuccess(response.data);
}


function* startTrackingMiddleware(action) {
    const { edition } = action.payload;

    const response = yield call(startTracking, action.payload);

    if (response.status === 200) {
        yield put({
            type: START_TRACKING_SUCCESS,
            payload: { edition }
        })
    }
}   

function* addReviewMiddleware(action) {
    const response = yield call(addReview, action.payload);

    if (response.status === 200) {
        const { bookId, rate, comment, date } = action.payload;
        yield put({
            type: ADD_REVIEW_SUCCESS,
            payload: {
                bookId,
                content: {
                    rate,
                    comment,
                    date
                }
            }
        })
    }
}

function* addProgressMiddleware(action) {
    const response = yield call(addProgress, action.payload);

    if (response.status === 200 ) {
        yield put({
            type: ADD_PROGRESS_SUCCESS,
            payload: action.payload
        })
    }
}

function* getMyBooksMiddleware(action) {
    const response = yield call(getBooksOfAuthor, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_MY_BOOKS_SUCCESS,
            payload: response.data
        })
    }
}

function* getReviewsForBookMiddleware(action) {
    const { bookId, onSuccess } = action.payload;

    const response = yield call(getReviewsForBook, {bookId});

    if (response.status === 200) {
        console.log(response.data);
        onSuccess(response.data);
    }
}

function* addReplyMiddleware(action) {
    const response = yield call(addReply, action.payload);

    if (response.status === 200) {
        yield put({
            type: ADD_REPLY_SUCCESS,
            payload: action.payload
        })
    }
}

function* addEditionMiddleware(action) {
    const response = yield call(addEdition, action.payload);

    if (response.status === 200) {
        yield put({
            type: GET_MY_BOOKS,
            payload: {
                username: action.payload.username
            }
        })
    }
}

export default function* mainMiddleware() {
    yield takeEvery(LOGIN_REQUEST, loginMiddleware);
    yield takeEvery(SIGNUP_REQUEST, signupMiddleware);
    yield takeEvery(FETCH_BOOKS_REQUEST, fetchBook);
    yield takeEvery(SET_USERNAME, fetchUserInformation);
    yield takeEvery(SET_HOME_CONTENT, saveHomeContent);
    yield takeEvery(APPLY_FILTERS, applyFilters);
    yield takeEvery(GET_EDITIONS, getEditionsMiddleware);
    yield takeEvery(START_TRACKING, startTrackingMiddleware);
    yield takeEvery(ADD_REVIEW, addReviewMiddleware);
    yield takeEvery(ADD_PROGRESS, addProgressMiddleware);
    yield takeEvery(GET_MY_BOOKS, getMyBooksMiddleware);
    yield takeEvery(GET_REVIEWS_FOR_BOOK, getReviewsForBookMiddleware);
    yield takeEvery(ADD_REPLY, addReplyMiddleware);
    yield takeEvery(ADD_EDITION, addEditionMiddleware);
}