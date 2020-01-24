import React from "react";
import $ from "jquery";
import {
	Button,
	Image,
	Container,
	Row,
	Col,
	Form,
	Modal,
	ButtonToolbar
} from "../../node_modules/react-bootstrap";
import "../CSS/loginpage.css";
import Nav from "./navbar";
import Airtable from "airtable";

const base = new Airtable({ apiKey: "key68OVjXXeLKQuEl" }).base(
	"app6JuPyfzqD3RZiA"
);
//const table = base("ogranization_accounts");
class Loginpage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			ogranization_accounts: [],
			username: "",
			password: ""
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	componentDidMount() {
		base("organization_accounts")
			.select({
				filterByFormula: "{org_acc_id}"
			})
			.eachPage(
				(ogranization_accounts, fetchNextPage) => {
					this.setState({
						ogranization_accounts
					});
					console.log(ogranization_accounts);
					fetchNextPage();
				},
				function done(error) {
					console.log(error);
				}
			);
	}

	showButtons() {
		$("#add-agency-button").removeClass("disabled");
		$("#edit-agency-button").removeClass("disabled");
		//document.getElementById("add-agency-button").removeAttribute("disabled");
		//document.getElementById("add-agency-button").setAttribute("active", "true");
	}

	handleSubmit(id, e) {
		/* {
			history.push("/ButtonResults/" + id);
		} */
		e.preventDefault();
	}

	handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
	}

	render() {
		return (
			<div id="login-page">
				<div id="main-component-login">
					<Container id="organization-login" class="centered">
						<Row>
							<Col>
								<h1 class="aligncenter">Organization Login</h1>
							</Col>
							<Col>
								<p class="alignright">
									Here by mistake?
									<br></br>
									<Button href="/" size="sm" variant="dark">
										Back
									</Button>
								</p>
							</Col>
						</Row>
					</Container>
				</div>
				<div id="login-form">
					<Container id="login-container" class="centered">
						<Row>
							<Col md={{ span: 4, offset: 1 }}>
								<form onSubmit={e => this.handleSubmit()}>
									<Form.Group controlId="formBasicUsername">
										<Form.Label>Enter Username</Form.Label>
										<Form.Control
											type="username"
											placeholder="Username"
											value={this.state.username}
											onChange={this.handleChange}
										/>
										<ForgotUsername />
									</Form.Group>

									<Form.Group controlId="formBasicPassword">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Password"
											value={this.state.password}
											onChange={this.handleChange}
										/>
										<ForgotPassword />
									</Form.Group>
									<button
										//onClick={this.showButtons}
										class="btn btn-dark"
										type="submit"
									>
										Submit
									</button>
								</form>
							</Col>
							<Col md={{ offset: 1 }}>
								<br></br>
								<h4>
									This login page is for Organizations ONLY. If you are part of
									an Organization and would like to make an account, please
									contact Jordan Lyons at contact@email.com.
								</h4>
							</Col>
						</Row>
					</Container>
				</div>
			</div>
		);
	}
}

function UsernameModal(props) {
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Username Recovery
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container id="username-recovery-modal">
					<Form>
						<Form.Group as={Row} controlId="form-username-recovery">
							<Form.Label column sm="2">
								Enter Email used for Organization
							</Form.Label>
							<Col sm="10">
								<br></br>
								<Form.Control type="email" placeholder="Email Address" />
							</Col>
						</Form.Group>
					</Form>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-primary" href="/">
					Submit
				</Button>
				<Button variant="dark" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

function PasswordModal(props) {
	return (
		<Modal
			{...props}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Password Recovery
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Container id="password-recovery-modal">
					<Form>
						<Form.Group as={Row} controlId="form-password-recovery">
							<Form.Label column sm="2">
								Enter Organization's Username
							</Form.Label>
							<Col sm="10">
								<br></br>
								<Form.Control type="Username" placeholder="Username" />
							</Col>
						</Form.Group>
					</Form>
				</Container>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="outline-primary" href="/">
					Submit
				</Button>
				<Button variant="dark" onClick={props.onHide}>
					Close
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ForgotUsername() {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<ButtonToolbar>
			<Button
				variant="outline-info"
				size="sm"
				onClick={() => setModalShow(true)}
			>
				Forgot Username?
			</Button>

			<UsernameModal show={modalShow} onHide={() => setModalShow(false)} />
		</ButtonToolbar>
	);
}

function ForgotPassword() {
	const [modalShow, setModalShow] = React.useState(false);

	return (
		<ButtonToolbar>
			<Button
				variant="outline-info"
				size="sm"
				onClick={() => setModalShow(true)}
			>
				Forgot Password?
			</Button>

			<PasswordModal show={modalShow} onHide={() => setModalShow(false)} />
		</ButtonToolbar>
	);
}

export default Loginpage;
