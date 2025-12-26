import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import Subscription from './pages/Subscription';
import CourseDetail from './pages/CourseDetail';
import LessonViewer from './pages/LessonViewer';
import MyProgress from './pages/MyProgress';
import LearningPaths from './pages/LearningPaths';
import Community from './pages/Community';
import Achievements from './pages/Achievements';
import __Layout from './Layout.jsx';


export const PAGES = {
    "Dashboard": Dashboard,
    "Courses": Courses,
    "Subscription": Subscription,
    "CourseDetail": CourseDetail,
    "LessonViewer": LessonViewer,
    "MyProgress": MyProgress,
    "LearningPaths": LearningPaths,
    "Community": Community,
    "Achievements": Achievements,
}

export const pagesConfig = {
    mainPage: "Dashboard",
    Pages: PAGES,
    Layout: __Layout,
};