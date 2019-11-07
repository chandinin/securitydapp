App = {
    loading: false,
    contracts:{},

    load: async()=>{
        //load app
        console.log("app loading...")
        await App.loadWeb3()
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },
    loadWeb3: async () => {
        if (typeof web3 !== 'undefined') {
          App.web3Provider = web3.currentProvider
          web3 = new Web3(web3.currentProvider)
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
          window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
            await ethereum.enable()
            // Acccounts now exposed
            web3.eth.sendTransaction({/* ... */})
          } catch (error) {
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
          window.web3 = new Web3(web3.currentProvider)
          // Acccounts always exposed
          web3.eth.sendTransaction({/* ... */})
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async()=>{
          App.account = web3.eth.accounts[0]
          console.log(App.account)
      },

      loadContract: async()=>{
          const customerInformation = await $.getJSON('CustomerInformation.json')
          App.contracts.CustomerInformation = TruffleContract(customerInformation)
          App.contracts.CustomerInformation.setProvider(App.web3Provider)
          App.customerInformation = await App.contracts.CustomerInformation.deployed()
      },

      render: async()=>{
           // Prevent double render
        if (App.loading) {
        return
      }

      // Update app loading state
    App.setLoading(true)

    // Render Account
        $('#account').html(App.account)

        await App.renderTasks()

    // Update loading state
    App.setLoading(false)

      },

      renderTasks: async () => {
        // Load the total task count from the blockchain
        const customerCount = await App.customerInformation.customerCount()
        const $customerTemplate = $('.customerTemplate')
    
        // Render out each task with a new task template
        for (var i = 1; i <= customerCount; i++) {
          // Fetch the task data from the blockchain
          const customer = await App.customerInformation.customers(i)
          const customerId = customer[0].toNumber()
          const customerFirstName = customer[1]
          const customerSSN = customer[2]
    
          // Create the html for the task
          const $newCustomerTemplate = $customerTemplate.clone()
          $newCustomerTemplate.find('.content').html(customerId)
          $newCustomerTemplate.find('input')
                          .prop('name', customerId)
                          .prop('checked', customerSSN)
                          // .on('click', App.toggleCompleted)
    
          // Put the task in the correct list
          if (customerSSN) {
            $('#completedCustomerList').append($newCustomerTemplate)
          } else {
            $('#customerList').append($newCustomerTemplate)
          }
    
          // Show the task
          $newCustomerTemplate.show()
        }
      },

      createCustomer: async()=>{
          App.setLoading(true)
          const name = $('#newCustomer').val()
          await App.customerInformation.createCustomer(true,false)
          window.location.reload()
      },

      setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
          loader.show()
          content.hide()
        } else {
          loader.hide()
          content.show()
        }
      },

     
}

$(() =>{
    $(window).load(()=>{
        App.load()
    })
})