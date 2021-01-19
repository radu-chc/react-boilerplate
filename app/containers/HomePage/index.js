/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from 'react-bootstrap/Button';

// Using Virtualized Select component in order to optimize performance.
import Select from 'react-select-virtualized';

import { Graph } from "react-d3-graph";

import { FormattedMessage } from 'react-intl';
import styled from "styled-components";

import doge from '../../images/doge.png';
import messages from './messages';


const PageWrapper = styled.div`
	padding: 5em 10em 5em 5em;
`;

const SelectorsWrapper = styled.div`
	padding-bottom: 2em;
	border-bottom: 1px solid black;
`;

const GraphWrapper = styled.div`
  border: 1px solid #777;

  svg[name="svg-container-graph-id"] {
	width: 100% !important;
	height: 600px !important;
  }
`;

const ClearButton = styled(Button)`
  margin-top: 2em;
`;

const InstructionsWrapper = styled.div`
  margin-top: 2em;
  color: #777;
`;

class HomePage extends React.Component {

 	constructor(props) {
    	super(props);

    	const lightningGraph = require('./lightning_graph.json');

    	// Create array of all node ids
    	this.nodes = lightningGraph.nodes.map((node) => {
    		return { value: node.pub_key, label: node.alias }
    	});

    	// Depth Levels
    	this.depths = [{
    		value: 1,
    		label: "One Level",
    	},{
    		value: 2,
    		label: "Two Levels"
    	},{
    		value: 3,
    		label: "Three Levels"
    	}];

    	this.linksMap = {};

    	// Creating Edge Map.
    	lightningGraph.edges.map((edge) => {
    		if (!this.linksMap[edge.node1_pub]) {
	    		this.linksMap[edge.node1_pub] = [];
	    	}

    		if (!this.linksMap[edge.node2_pub]) {
	    		this.linksMap[edge.node2_pub] = [];
	    	}

    		this.linksMap[edge.node1_pub].push(edge.node2_pub);

    		// Adding reverse edge, since graph is undirected
    		this.linksMap[edge.node2_pub].push(edge.node1_pub);
    	});

	    // not being used if remote load is off
	    this.myConfig = {
			nodeHighlightBehavior: true,
			node: {
				color: "lightgreen",
				size: 120,
				highlightStrokeColor: "blue",
			},
			link: {
				highlightColor: "lightblue",
			},
		};

    	this.state = {
    		selectedNode: null,
    		depth: 1,
    		data: {
			  nodes: [],
			  links: []
    		}
    	};
	}

	onClickNode = (nodeId) => {
	  window.alert(`Clicked node ${nodeId}`);
	};

	onClickLink = (source, target) => {
	  window.alert(`Clicked link between ${source} and ${target}`);
	};

	onDepthChanged = (depth) => {
    	this.refreshGraph({value: this.state.selectedNode}, depth.value);
	}

	onSourceChange = (selectedNode) => {
    	this.refreshGraph(selectedNode, this.state.depth);
	}

	onClear = () => {
    	this.setState({
    		selectedNode: null,
    		depth: 1,
    		data: {
			  nodes: [],
			  links: []
    		}
    	});
	}

	refreshGraph = (selectedNode, depth) => {
    	const nodesQueue = [selectedNode.value];
    	const nodesObjArr = [{id: selectedNode.value}];
    	const nodesArr = [selectedNode.value];

    	let currentDepth = 0;

    	while (currentDepth < depth && nodesQueue.length > 0) {
    		const sourceNode = nodesQueue.shift();
    		
    		if(this.linksMap[sourceNode]) {
    			let newTargetNodesObj = [];
	    		this.linksMap[sourceNode].map((targetNode) => {
		    		if (!nodesArr.includes(targetNode)) {
		    			nodesQueue.push(targetNode);
			    		nodesArr.push(targetNode);
				  		newTargetNodesObj.push({id: targetNode});
				  	}
			  	});

		    	nodesObjArr.push(...newTargetNodesObj);
			  	currentDepth++
		  	}
	  	}

	  	let links = [];
	  	let existingLinksMap = {};

	  	nodesArr.forEach(sourceNode => {
	  		if (this.linksMap[sourceNode]) {
		  		let newNodeLinks = [];

		  		this.linksMap[sourceNode].map((targetNode) => {
		  			// Only include edges to nodes that exist in the graph
		  			if (nodesArr.includes(targetNode) && (!existingLinksMap[targetNode]|| 
		  					!existingLinksMap[targetNode].includes(sourceNode))) {

		  				if (!existingLinksMap[sourceNode]) {
		  					existingLinksMap[sourceNode] = [];
		  				}
		  				
		  				existingLinksMap[sourceNode].push(targetNode);


		  				newNodeLinks.push({ source: sourceNode, target: targetNode});
				  	}
	  		  	})

		  		links.push(...newNodeLinks);	
	  		}
  		});

    	this.setState({
    		selectedNode: selectedNode.value,
    		data: {
			  nodes: nodesObjArr,
			  links
			},
			depth

    	}, () => {
	      // Log new state to console
	      console.log(this.state);
	    });
  	}

	render() {
		return (
			<PageWrapper>
				<SelectorsWrapper>
				    <h1>
				      <FormattedMessage {...messages.header} />
				      <img src={doge} alt="Doge" height="75px" width="75px"/>
				    </h1>

				    <h2> Choose Source Node </h2>
				    <Select
				        id="source-node"
	          			onChange={this.onSourceChange}
				        options={this.nodes}
				      />

				    <h2> Choose Depth Level </h2>
				    <Select
				    	defaultValue={this.depths[0]}
				        id="depth-level"
	          			onChange={this.onDepthChanged}
				        options={this.depths}
				     />

				    <ClearButton
						variant="primary"
						onClick={this.onClear}>
						Clear Graph
					</ClearButton>

			    </SelectorsWrapper>

			    <GraphWrapper>
				    <Graph
					  id="graph-id"
					  data={this.state.data}
					  config={this.myConfig}
					  onClickNode={this.onClickNode}
					  onClickLink={this.onClickLink}
					/>
				</GraphWrapper>

				<InstructionsWrapper>
					<h3>
				      <FormattedMessage {...messages.instruction1} />
					</h3>

					<h3>
				      <FormattedMessage {...messages.instruction2} />
					</h3>

					<h3>
				      <FormattedMessage {...messages.instruction3} />
					</h3>

					<h3>
				      <FormattedMessage {...messages.instruction4} />
					</h3>
				</InstructionsWrapper>
		    </PageWrapper>
		  );
	}
}

export default HomePage;