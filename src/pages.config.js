import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Subscription from './pages/Subscription';
import CourseDetail from './pages/CourseDetail';
import LessonViewer from './pages/LessonViewer';
import MyProgress from './pages/MyProgress';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Courses": Courses,
    "Subscription": Subscription,
    "CourseDetail": CourseDetail,
    "LessonViewer": LessonViewer,
    "MyProgress": MyProgress,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};