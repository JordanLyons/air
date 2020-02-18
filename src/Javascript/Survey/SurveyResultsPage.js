import React from 'react';
// import { Jumbotron } from 'react-bootstrap';
import SurveyResult from './SurveyResult';
import PrintSaveShare from "../CategoryResults/PrintSaveShare";
import '../../CSS/styles.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import PrintButton from '../../components/PrintButton'
import Pdf from "react-to-pdf";
import Button from "react-bootstrap/Button"

const ref = React.createRef();

export default class SurveyResultsPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
        names: [],
        last_indices: [],
        services: [],
        organizations: [],
        addresses: [],
        names_checked: false,
        taxonomies_html: [],
        should_update: false,
        array_length: 0,
        end_indices: []
    }
    this.renderTaxonomy = this.renderTaxonomy.bind(this);
  }

    // shouldComponentUpdate(nextProps, nextState){
    //   if(nextState.should_update){
    //     return true;
    //   }
    //   return false;

    // }
    componentDidMount() {
      var url = window.location.href;
      var index = url.lastIndexOf("/")
      url = url.slice(index + 1, url.length)
      var tax_ids = url.split('&taxid=')
      var array_length = 0
      for(let i = 0; i < tax_ids.length; i++){
        if(tax_ids[i] !== ""){
          array_length += 1
          this.props.database('taxonomy').find(tax_ids[i], (err, record) => {
            if (err) { console.error(err); return; }
            if(this.state.names.length !== array_length){
              this.setState(previousState => ({
                names: [...previousState.names, record.fields['name']],
              }));
              var filter = "({taxonomy} = '" + record.fields['name'] + "')"
              this.props.database('services').select({
                fields: ["id", "Organization", "address"],
                filterByFormula: filter,
                view: "Grid view",
              }).eachPage((services, fetchNextPage) => {
                console.log("got here")
                console.log(services)
                this.setState(previousState => ({
                  services: [...previousState.services, services]
                }));
                // this.forceUpdate()
                for (let i = 0; i < services.length; i++){
                  console.log("Got Here")
                  this.props.database('organizations').find(services[i].fields["Organization"], (err, organization) => {
                    if (err) { 
                      console.error(err); 
                      return; 
                    }
                    else if (!err){
                      console.log("GOT HERE")
                      this.setState(previousState => ({
                          organizations: [...previousState.organizations, organization],
                      }));
                      if(typeof services[i].fields["address"] !== "undefined"){ 
                        if (err) { 
                          return; 
                        }
                        else {
                          this.props.database('address').find(services[i].fields["address"], (err, address) => {
                            var address_dict = {
                              address: address.fields["address_1"],
                              city: address.fields["city"],
                              state: address.fields["State"],
                              zip_code: address.fields["Zip Code"],
                            };
                            this.setState(previousState => ({
                              addresses: [...previousState.addresses, address_dict],
                            }));
                          });
                        }
                      }
                      else if(typeof services[i].fields["address"] !== "undefined") {
                        var address = {
                            address: "Not Available",
                            city: "Not Available",
                            state: "Not Available",
                            zip_code: "Not Available",
                        };
                        this.setState(previousState => ({
                          addresses: [...previousState.addresses, address],
                        }));

                      }
                    }
                  });
                  
                }

                fetchNextPage();
              }, function done(error) {
              });
            }
            else {
              this.setState(previousState => ({
                names: [...previousState.names, record.fields['name']],
                should_update: true
              }));
            }
        })
        }
        else{
          array_length -= 1
          console.log(array_length)
        }
      }
      // if(this.state.names.length === tax_ids.length){
      //   this.setState(previousState => ({should_update:true}))
      // }


      // var filter = "({taxonomy} = '" + this.state.taxonomy_name + "')"
      // this.props.database('services').select({
      //   fields: ["id", "Organization", "address"],
      //   filterByFormula: filter,
      //   view: "Grid view",
      // }).eachPage((services, fetchNextPage) => {
      //   this.setState({
      //     services
      //   });
      //   this.forceUpdate()
      //   for (let i = 0; i < services.length; i++){
      //     this.props.database('organizations').find(services[i].fields["Organization"], (err, organization) => {
      //       if (err) { 
      //         console.error(err); 
      //         return; 
      //       }
      //       else if (!err){
              
      //         this.setState(previousState => ({
      //             organizations: [...previousState.organizations, organization],
      //         }));
      //         if(typeof services[i].fields["address"] !== "undefined"){ 
      //           if (err) { 
      //             return; 
      //           }
      //           else {
      //             this.props.database('address').find(services[i].fields["address"], (err, address) => {
      //               var address_dict = {
      //                 address: address.fields["address_1"],
      //                 city: address.fields["city"],
      //                 state: address.fields["State"],
      //                 zip_code: address.fields["Zip Code"],
      //               };
      //               this.setState(previousState => ({
      //                 addresses: [...previousState.addresses, address_dict],
      //               }));
      //             });
      //           }
      //         }
      //         else if(typeof services[i].fields["address"] !== "undefined") {
      //           var address = {
      //               address: "Not Available",
      //               city: "Not Available",
      //               state: "Not Available",
      //               zip_code: "Not Available",
      //           };
      //           this.setState(previousState => ({
      //             addresses: [...previousState.addresses, address],
      //           }));

      //         }
      //       }
      //     });
          
      //   }

      //   fetchNextPage();
      // }, function done(error) {
      // });
  }
  componentDidUpdate(){
    let end_index = 0;
    console.log("Services: " + this.state.services)
    if(this.state.should_update){    
      if(!this.state.names_checked){
        this.renderTaxonomy(this.state.names);
        this.setState(previousState => ({
          names_checked: true
        }))
      }
    }
    console.log(this.state.names)
    
    
  }

  // taxonomies = []
  renderTaxonomy(names) {
    console.log(names.length)
    for (let i = 0; i < names.length; i++){
      this.state.taxonomies_html.push(
      <div className="jumbotron" key={names[i]}>
        <h4>{names[i]} Results: </h4>
        <div id="printSaveShare">
            <PrintButton id="printSaveShare"></PrintButton>
            <Pdf targetRef={ref} filename="code-example.pdf">
              {({ toPdf }) => <Button onClick={toPdf} variant="dark">Download As PDF</Button>}
            </Pdf>
        </div>
        {this.state.organizations.length > 0 ? (
          this.state.organizations.map((organization, index) =>
            <div key={organization.fields['id']}>
              <SurveyResult 
                database = {this.props.database}
                agency_id = {organization.id}
                agency_name = {organization.fields['name'] === undefined ? "Not available" : organization.fields['name']} 
                agency_website = {organization.fields['url'] === undefined ? "Website Not Available" : organization.fields['url']}
                phone_number={organization.fields['phones'] === undefined ? "Phone Number Not Available" : organization.fields['phones']} 
                email={organization.fields['email'] === undefined ? "Email Not Available" : organization.fields['email']} 
                address={typeof this.state.addresses[index] === "undefined" ? "Street Not Available" :this.state.addresses[index]['address']} 
                city={typeof this.state.addresses[index] === "undefined" ? "City Not Available" :this.state.addresses[index]['city']} 
                state={typeof this.state.addresses[index] === "undefined" ? "State Not Available" :this.state.addresses[index]['state']} 
                zip_code={typeof this.state.addresses[index] === "undefined" ? "Zip Code Not Available" :this.state.addresses[index]['zip_code']}
              />
              <br />
            </div>
          )
          ):(null)
        }
      </div>);
    }
    
  };

  renderOrganizations(){

  }

  render(){
    return (
      <div ref={ref}>
        {this.state.taxonomies_html}
      </div>
      // <div>
      //   <div className="jumbotron">
      //     <h4>{this.state.taxonomy_name} Results: </h4>
      //     <div id="printSaveShare">
      //       <PrintSaveShare />
      //     </div>
      //   </div>
      //   {this.state.organizations.length > 0 ? (
      //     this.state.organizations.map((organization, index) =>
      //       <div key={organization.fields['id']}>
      //         <SurveyResult 
      //           database = {this.props.database}
      //           agency_id = {organization.id}
      //           agency_name = {organization.fields['name'] === undefined ? "Not available" : organization.fields['name']} 
      //           agency_website = {organization.fields['url'] === undefined ? "Website Not Available" : organization.fields['url']}
      //           phone_number={organization.fields['phones'] === undefined ? "Phone Number Not Available" : organization.fields['phones']} 
      //           email={organization.fields['email'] === undefined ? "Email Not Available" : organization.fields['email']} 
      //           address={typeof this.state.addresses[index] === "undefined" ? "Street Not Available" :this.state.addresses[index]['address']} 
      //           city={typeof this.state.addresses[index] === "undefined" ? "City Not Available" :this.state.addresses[index]['city']} 
      //           state={typeof this.state.addresses[index] === "undefined" ? "State Not Available" :this.state.addresses[index]['state']} 
      //           zip_code={typeof this.state.addresses[index] === "undefined" ? "Zip Code Not Available" :this.state.addresses[index]['zip_code']}
      //         />
      //         <br />
      //       </div>
      //     )
      //     ):(null)
      //   }
      // </div>

    );
  }
}
