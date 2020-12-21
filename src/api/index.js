import Axios from "axios";
const baseURL = "http://localhost:8080";
export default {
	getType(){
		return Axios.get(baseURL+"/admin/shopType")
	}
}
