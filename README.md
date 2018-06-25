Structure:

App: {
    props: {
        isLoading,
        globalError,
    },
    Home: {
        props: {
            user: [],
            messages: [],
            matches: [],

        }
    }

}


## HEADER
<!-- Header left -->
1. Logo
2. Button Text 'Browse all'
3. Button Text 'Start swiping'
<!-- Header right -->
1. Avatar image with drop down list of: 'Profile', 'Settings', 'Help', 'Sign Out'
2. Button Icon 'Messages'
3. Button Icon 'Matches'

## Jumbotron
<!-- Right -->
Search field with 'What are u looking for?'
<!-- Left -->
if have products: 'Matces to your products'
if no products: 'They would like 'Guiter' in return'
<!-- With product -->
blocks of people that want to trade with the product of the same category.
(If there are any products that match to the same category || *)
<!-- Without product -->
Random blocks of people that trade and what they want in return

## Hot in your area
2 rows list of products that get alot of visitors (near user area)

## Recent products
2 rows list of newest products

## Browse all Button

## Download app section

## Footer
Icons: facebook, twitter youtube
And links






## Swiping
Header, left sidebar with list of available products and radio button
and then he can check every one
notification on top for every user with 'X' message tell: 'You can start swiping left (dislike) or right (like), you can select with witch product you want to trade by selecting it on the left'.


## Browse all
left side bar with checkboxes`
Search:
localhost/browse/category/CategoryName/subCategory
localhost/browse/product/CategoryName/subCategory
Category = Single dropdown;
Price range = Slider with steps (by selected product or all)
When category set to all user can filter only price range.
If category is specific, open another tool bar with match category filters.






### Server Side

User: {
    id,
    name,
    email,
    facebookID,
    googleID,
    twitterID,
}

Post: {
    id,
    title,
    price: {min, max},
    description,
    categoryID,
    askFor: [categoryID],
}

Category: {
    id,
    name,
    subCategory: [SubCategoryID],
    fields: []
}

SubCategoryID: {
    id,
    name,
    fields: []
}


/// USER
[
  '{{repeat(5, 7)}}',
  {
    firstName: '{{firstName()}}',
    lastName: '{{surname()}}',
    email: '{{email()}}',
    password: "123123",
    location: {
        longitude: 23.1323,
        latitude: 231.231
    },
    country: "IL"
  }
]
