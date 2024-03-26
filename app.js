// src/app.js

import { Auth, getUser } from './auth';
import { postFragments, getFragment, getUserFragments, getFragmentToHtml, getUserFragmentsNotExpanded, getFragmentMetaData } from './api';

async function init() {
    // Get our UI elements
    const userSection = document.querySelector('#user');
    const loginBtn = document.querySelector("#login");
    const logoutBtn = document.querySelector("#logout");
    const postButton = document.querySelector("#post");
    const content = document.querySelector("#content");
    const contentType = document.querySelector("#type");
    const get_id = document.querySelector("#get_id");
    const getById = document.querySelector("#getbyid");
    const getMetaData = document.querySelector("#getMetaData");
    const getButton = document.querySelector("#getall");
    const getAllNotExpButton = document.querySelector("#getallnotexpanded");
    const getInfo = document.querySelector("#getInfo");
    const infoData = document.querySelector("#content-type");
    const getIdInHtml = document.querySelector("#getbyidtohtml")

    // Wire up event handlers to deal with login and logout.
    loginBtn.onclick = () => {
        // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
        // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
        Auth.federatedSignIn();
    };
    logoutBtn.onclick = () => {
        // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
        // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
        Auth.signOut();
    };

    // See if we're signed in (i.e., we'll have a `user` object)
    const user = await getUser();

    // TODO: later in the course, we will show all the user's fragments in the HTML...
    if (!user) {
        // Disable the Logout button
        logoutBtn.disabled = true;
        return;
    }

    // Log the user info for debugging purposes
    console.log({ user });

    // Update the UI to welcome the user
    userSection.hidden = false;

    // Show the user's username
    userSection.querySelector('.username').innerText = user.username;

    // Disable the Login button
    loginBtn.disabled = true;
    // Do an authenticated request to the fragments API server and log the result
    postButton.onclick = async () => {
        let data = content.value;
        let contentTypeValue =
            contentType.options[contentType.selectedIndex].value;
        await postFragments(user, contentTypeValue, data);
    };
    getButton.onclick = async () => {
        // Get a fragment from the fragments API server
        let fragmentHtml = "";
        let fragmentList = document.querySelector(".fragmentList");
        fragmentList.innerHTML = "";
        getUserFragments(user).then((data) => {
            data = data.fragments;
            if (data.length) {
                // Create the titles for each column and add to the table
                let header = document.createElement("tr");
                let headerOptions = ["Id", "Created", "Updated", "Type"];
                for (let column of headerOptions) {
                    let th = document.createElement("th");
                    th.append(column);
                    header.appendChild(th);
                }
                fragmentList.appendChild(header);

                for (let fragment of data) {
                    console.log("fragment", fragment);

                    let tr = document.createElement("tr");
                    let id = document.createElement("td");
                    let created = document.createElement("td");
                    let updated = document.createElement("td");
                    let type = document.createElement("td");

                    id.append(fragment.id);
                    created.append(fragment.created);
                    updated.append(fragment.updated);
                    type.append(fragment.type);
                    tr.append(id, created, updated, type);

                    fragmentList.appendChild(tr);
                }
            } else {
                let td = document.createElement("td");
                td.append("No fragments were found");

                fragmentList.append(td);
            }
        });
        fragmentList.html = fragmentHtml;
    };

    getAllNotExpButton.onclick = async () => {
        // Get a fragment from the fragments API server
        let fragmentHtml = "";
        let fragmentList = document.querySelector(".fragmentList");
        fragmentList.innerHTML = "";
        getUserFragmentsNotExpanded(user).then((data) => {
            console.log(data);
            data = data.fragments;
            if (data.length) {
                // Create the titles for each column and add to the table
                let header = document.createElement("tr");
                let headerOptions = ["Id"];
                for (let column of headerOptions) {
                    let th = document.createElement("th");
                    th.append(column);
                    header.appendChild(th);
                }
                fragmentList.appendChild(header);

                for (let fragment of data) {
                    console.log("fragment", fragment);

                    let tr = document.createElement("tr");
                    let id = document.createElement("td");
                    let created = document.createElement("td");
                    let updated = document.createElement("td");
                    let type = document.createElement("td");

                    id.append(fragment);
                    tr.append(id);

                    fragmentList.appendChild(tr);
                }
            } else {
                let td = document.createElement("td");
                td.append("No fragments were found");

                fragmentList.append(td);
            }
        });
        fragmentList.html = fragmentHtml;
    };

    getById.onclick = async () => {
        var res = await getFragment(user, get_id.value);
        infoData.innerHTML = res;
    };

    getMetaData.onclick = async () => {
        fragmentHtml = "";
        let fragmentList = document.querySelector(".fragmentList");
        fragmentList.innerHTML = "";
        getFragmentMetaData(user, get_id.value).then((data) => {
            console.log(data);
            if (data) {
                // Create the titles for each column and add to the table
                let header = document.createElement("tr");
                let headerOptions = ["Id", "Created", "Updated", "Type"];
                for (let column of headerOptions) {
                    let th = document.createElement("th");
                    th.append(column);
                    header.appendChild(th);
                }
                fragmentList.appendChild(header);
                let tr = document.createElement("tr");
                let id = document.createElement("td");
                let created = document.createElement("td");
                let updated = document.createElement("td");
                let type = document.createElement("td");
                id.append(data.id);
                created.append(data.created);
                updated.append(data.updated);
                type.append(data.type);
                tr.append(id, created, updated, type);
                fragmentList.appendChild(tr);
            } else {
                let td = document.createElement("td");
                td.append("No fragments were found");

                fragmentList.append(td);
            }
                fragmentList.html = fragmentHtml;
            });
    };

    getIdInHtml.onclick = async () => {
        var res = await getFragmentToHtml(user, get_id.value);
        infoData.innerHTML = res;
    };

}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);