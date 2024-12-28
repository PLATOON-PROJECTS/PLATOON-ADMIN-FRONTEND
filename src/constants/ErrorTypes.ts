import { shallowRef } from "vue";
import AuthenticationErrorAlert from "../components/alerts/AuthenticationErrorAlert.vue";
import BigTimeTechErrorAlert from "../components/alerts/BigTimeTechErrorAlert.vue";
import ServerErrorAlert from "../components/alerts/ServerErrorAlert.vue";
import TechnicalErrorAlert from "../components/alerts/TechnicalErrorAlert.vue";
import UserErrorAlert from "../components/alerts/UserErrorAlert.vue";

const errorTypes = {
  authError: shallowRef(AuthenticationErrorAlert),
  bigTimeTechError: shallowRef(BigTimeTechErrorAlert),
  serverError: shallowRef(ServerErrorAlert),
  technicalError: shallowRef(TechnicalErrorAlert),
  userError: shallowRef(UserErrorAlert),
};

export default errorTypes;
