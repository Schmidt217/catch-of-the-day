import React from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import Order from "./Order";
import Inventory from "./Inventory";
import Fish from "./Fish";
import sampleFishes from "../sample-fishes";
import base from "../base";

class App extends React.Component {
	state = {
		fishes: {},
		order: {},
	};

	static propTypes = {
		match: PropTypes.object.isRequired,
	};

	componentDidMount() {
		const { params } = this.props.match;

		const localStorageRef = localStorage.getItem(params.storeId);

		if (localStorageRef) {
			this.setState({ order: JSON.parse(localStorageRef) });
		}
		this.ref = base.syncState(`${params.storeId}/fishes`, {
			context: this,
			state: "fishes",
		});
	}
	componentDidUpdate() {
		localStorage.setItem(
			this.props.match.params.storeId,
			JSON.stringify(this.state.order)
		);
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	addFish = (fish) => {
		// 1. Take a copy of the existing state
		const fishes = { ...this.state.fishes };
		// 2. Add new fish to fishes
		fishes[`fish${Date.now()}`] = fish;
		// 3. set new fishes object to state
		this.setState({ fishes });
	};

	updateFish = (key, updatedFish) => {
		// 1. Take copy of current state
		const fishes = { ...this.state.fishes };
		// 2. Update that state
		fishes[key] = updatedFish;
		// 3. Set that to state
		this.setState({ fishes });
	};

	deleteFish = (key) => {
		// 1. take a copy of state
		const fishes = { ...this.state.fishes };
		// 2. Update the state
		fishes[key] = null;
		// 3. update state
		this.setState({ fishes });
	};

	loadSampleFishes = () => {
		this.setState({ fishes: sampleFishes });
	};

	addToOrder = (key) => {
		// 1. take a copy of state
		const order = { ...this.state.order };
		// 2. Either add to order or update the number in the order
		order[key] = order[key] + 1 || 1;
		// 3. Call set state to update state object
		this.setState({ order });
	};

	removeFromOrder = (key) => {
		const order = { ...this.state.order };
		delete order[key];
		this.setState({ order });
	};

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="fishes">
						{Object.keys(this.state.fishes).map((key) => (
							<Fish
								key={key}
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
						))}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					loadSampleFishes={this.loadSampleFishes}
					updateFish={this.updateFish}
					deleteFish={this.deleteFish}
					fishes={this.state.fishes}
					storeId={this.props.match.params.storeId}
				/>
			</div>
		);
	}
}

export default App;
