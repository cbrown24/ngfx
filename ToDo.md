# Todo

## Shortcuts
- Missing page-not-found, and other error handling
- No perisitence layer/storage
- No security considerations were taken
- No automated testing due to time constraints
- No consideration for UI styling due to time constraints. Effort was spend on getting the basic components and routing working 
- I realize at the end of the excercise that some required fields are missing from the table. I would extend the Conversion class with required fields.

## Improvements
- Stying and layout
- If authentication was a requirement I would use JWT
- If persistence was required, I would use Python Flask/SQLAlchemy or Django unless requirements requirements warranted a more complex or performant solution.
- Offering other currencies for conversion could be done by with angular router. A tab allowing selection of cuurings could be added via a Navbar.
- CI/CD would largely depend on how the organisation has chosen to do this. I'm most familiar with Jenkins automating such pipelines, but happy to pick up new skills in this area. Would ensure testing, code coverage, linting etc are performed prior artifact creation. NOTE: no considerations were given to testing during this excrcise.
