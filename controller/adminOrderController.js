const { default: mongoose } = require('mongoose');
const orderBase = require('../model/orderModel')
const productBase = require('../model/productModel')
const userBase = require ('../model/userModel.js')
const {Readable} = require ('stream')
const easyinvoice = require ('easyinvoice')




const loadOrderDetails = async ( req, res ) => {
    try {
        console.log(Date.now);
        const date = Date.now()
        const cuDate = new Date(date)
        console.log(cuDate.toLocaleDateString);
        const products = []
        const users = []
        const orders = []
        const fullorders = []
        const orderbase = await orderBase.find()
        // console.log(order[0].productDetails[0].product);
        for (let i = 0; i < orderbase.length; i++) {
            users.push(await userBase.findById(orderbase[i].user))
            for (let j = 0; j < orderbase[i].productDetails.length; j++) {
                orders.push(orderbase[i].productDetails[j])
                fullorders.push(orderbase[i])
                products.push(await productBase.findById(orderbase[i].productDetails[j].product))
            }
        }
           let product = products.reverse()
           let user = users.reverse()
           let order = orders.reverse()
           let fullorder = fullorders.reverse()
       

        res.render('admin-Order-List',{product,user,order,fullorder})
    } catch (error) {
        console.log(error);
        res.render('error')

    }
}


const orderDetails = async (req , res) => {
  try {
    const productid = new mongoose.Types.ObjectId(req.query.id)
    const userid = new mongoose.Types.ObjectId(req.query.userid)
    console.log(productid);
    console.log(userid);
    const details = await orderBase.aggregate([
        { $match: { user: userid } },
        { $unwind: '$productDetails' } ,
        { 
            $match: {
              'productDetails.product': productid // Filter to match the desired productId
            }
          },
      ]);  
 
    console.log(details,"    DETAILS");
   
    const user = await userBase.findById(userid)
    const product = await productBase.findById(productid)

    res.render('order-details',{details,user,product})
  } catch (error) {
    console.log(error);
    res.render('error')

  }
}


const changingStatus = async ( req , res ) => {
    try {
        console.log("hello");
        console.log(req.body);
        const userId = new mongoose.Types.ObjectId(req.body.userId)
        const id = new mongoose.Types.ObjectId(req.body.id)
        const status = req.body.status

        const result = await orderBase.updateOne(
            {
              user: userId, // Match the user ID
              'productDetails.product': id // Match the specific product ID within the array
            },
            {
              $set: {
                'productDetails.$.status': status // Update the status field within the matched array element
              }
            }
          );

    } catch (error) {
        console.log(error);
        res.render('error')

    }
}

const loadSalesReport = async (req,res) =>{   
  try {
      // const page = parseInt(req.query.page)
      // let limit = 10
      // let skip = page*10
      // const order = await orderBase.find({status : "Delivered"}).skip(skip).limit(limit)
      const order = await orderBase.aggregate([
        {
          $unwind: "$productDetails"
        },
        {
          $match: {
            "productDetails.status": "Delivered"
          }
        }
      ]);
      // console.log(order,"kkk");
      
      
      res.render('salesReport',{order})
  } catch (error) {
      console.log(error.message);
  }
}


// const salesReport = async (req, res) => {
//   try {
//       const date = req.query.date;
//       let orders;

//       const currentDate = new Date();

//       // Helper function to get the first day of the current month
//       function getFirstDayOfMonth(date) {
//           return new Date(date.getFullYear(), date.getMonth(), 1);
//       }

//       // Helper function to get the first day of the current year
//       function getFirstDayOfYear(date) {
//           return new Date(date.getFullYear(), 0, 1);
//       }

//       switch (date) {
//           case 'today':
//               // orders = await Order.find({
//               //     delivery_status: 'Delivered',
//               //     order_date : {
//               //         $gte: new Date().setHours(0, 0, 0, 0), // Start of today
//               //         $lt: new Date().setHours(23, 59, 59, 999), // End of today
//               //     },
//               // });
//               const orders = await orderBase.aggregate([
//                 {
//                   $unwind: "$productDetails"
//                 },
//                 {
//                   $match: {
//                     "productDetails.status": "Delivered",
//                     "productDetails.date": {
//                       $gte: new Date().setHours(0, 0, 0, 0), // Start of today
//                       $lt: new Date().setHours(23, 59, 59, 999), // End of today
//                     }
//                   }
//                 }
//               ]);
//               console.log(orders);
              
//               break;
//            case 'week':
//               const startOfWeek = new Date(currentDate);
//               startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
//               startOfWeek.setHours(0, 0, 0, 0);

//               const endOfWeek = new Date(startOfWeek);
//               endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
//               endOfWeek.setHours(23, 59, 59, 999);

//               // orders = await Order.find({
//               //     delivery_status: 'Delivered',
//               //     order_date: {
//               //         $gte: startOfWeek,
//               //         $lt: endOfWeek,
//               //     },
//               // });

//                orders = await orderBase.aggregate([
//                 {
//                   $unwind: "$productDetails"
//                 },
//                 {
//                   $match: {
//                     "productDetails.status": "Delivered",
//                     "productDetails.date": {
//                       $gte: startOfWeek,
//                       $lt:  endOfWeek
//                     }
//                   }
//                 }
//               ]);
              
//               break;
//           case 'month':
//               const startOfMonth = getFirstDayOfMonth(currentDate);
//               const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

//               // orders = await Order.find({
//               //     delivery_status: 'Delivered',
//               //     order_date : {
//               //         $gte: startOfMonth,
//               //         $lt: endOfMonth,
//               //     },
//               // });

//               orders = await orderBase.aggregate([
//                 {
//                   $unwind: "$productDetails"
//                 },
//                 {
//                   $match: {
//                     "productDetails.status": "Delivered",
//                     "productDetails.date": {
//                       $gte: startOfMonth,
//                       $lt:  endOfMonth
//                     }
//                   }
//                 }
//               ]);
//               break;
//           case 'year':
//               const startOfYear = getFirstDayOfYear(currentDate);
//               const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

//               // orders = await Order.find({
//               //     delivery_status: 'Delivered',
//               //     order_date: {
//               //         $gte: startOfYear,
//               //         $lt: endOfYear,
//               //     },
//               // });

//               orders = await orderBase.aggregate([
//                 {
//                   $unwind: "$productDetails"
//                 },
//                 {
//                   $match: {
//                     "productDetails.status": "Delivered",
//                     "productDetails.date": {
//                       $gte: startOfYear,
//                       $lt:  endOfYear
//                     }
//                   }
//                 }
//               ]);
             
//               break;
//           default:
//               // Fetch all orders
//               orders = await Order.find({ delivery_status : 'Delivered' });
//       }

//       const itemsperpage = 3;
//       const currentpage = parseInt(req.query.page) || 1;
//       const startindex = (currentpage - 1) * itemsperpage;
//       const endindex = startindex + itemsperpage;
//       const totalpages = Math.ceil(orders / 3);
//       const currentproduct = orders.slice(startindex,endindex);    

//  res.render('sales-report',{order:currentproduct,totalpages,currentpage})
    
//   } catch (error) {
//       console.log('Error occurred in salesReport route:', error);
//       // Handle errors and send an appropriate response
//       res.status(500).json({ error: 'An error occurred' });
//   }
// };

const salesReport = async (req, res) => {
  try {
    const date = req.query.date;
    let orders;

    const currentDate = new Date();

    // Helper function to get the first day of the current month
    function getFirstDayOfMonth(date) {
      return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    // Helper function to get the first day of the current year
    function getFirstDayOfYear(date) {
      return new Date(date.getFullYear(), 0, 1);
    }

    switch (date) {
      case 'today':
     
      const startOfToday = new Date().setHours(0, 0, 0, 0);
      const endOfToday = new Date().setHours(23, 59, 59, 999);

        orders = await orderBase.aggregate([
          {
            $unwind: "$productDetails"
          },
          {
            $match: {
              "productDetails.status": "Delivered",
              "productDetails.date": {
                $gte: startOfToday,
               $lt: endOfToday
              }
            }
          }
        ]);
        break;
      case 'week':
              const startOfWeek = new Date(currentDate);
              startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Set to the first day of the week (Sunday)
              startOfWeek.setHours(0, 0, 0, 0);

              const endOfWeek = new Date(startOfWeek);
              endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)
              endOfWeek.setHours(23, 59, 59, 999);


        orders = await orderBase.aggregate([
          {
            $unwind: "$productDetails"
          },
          {
            $match: {
              "productDetails.status": "Delivered",
              "productDetails.date": {
                $gte: startOfWeek,
                $lt: endOfWeek
              }
            }
          }
        ]);
        break;
      case 'month':
        const startOfMonth = getFirstDayOfMonth(currentDate);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);


        orders = await orderBase.aggregate([
          {
            $unwind: "$productDetails"
          },
          {
            $match: {
              "productDetails.status": "Delivered",
              "productDetails.date": {
                $gte: startOfMonth,
                $lt: endOfMonth
              }
            }
          }
        ]);
        break;
      case 'year':
        const startOfYear = getFirstDayOfYear(currentDate);
        const endOfYear = new Date(currentDate.getFullYear(), 11, 31, 23, 59, 59, 999);

        orders = await orderBase.aggregate([
          {
            $unwind: "$productDetails"
          },
          {
            $match: {
              "productDetails.status": "Delivered",
              "productDetails.date": {
                $gte: startOfYear,
                $lt: endOfYear
              }
            }
          }
        ]);
        break;
      default:
        // Fetch all orders
        orders = await orderBase.find({ delivery_status: 'Delivered' });
    }

    // Calculate pagination parameters
    const itemsPerPage = 3;
    const currentPage = parseInt(req.query.page) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const totalItems = orders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Get the current page of orders
    const currentProducts = orders.slice(startIndex, endIndex);

    res.render('salesReport', { order: currentProducts, totalpages: totalPages, currentpage: currentPage });

  } catch (error) {
    console.log('Error occurred in salesReport route:', error);
    // Handle errors and send an appropriate response
    res.status(500).json({ error: 'An error occurred' });
  }
};



  const downloadInvoice = async (req, res) => {
    try {
      const orders = await orderBase.aggregate([
        {
          $unwind: "$productDetails"
        },
        {
          $match: {
            "productDetails.status": "Delivered"
          }
        }
      ]);
      // console.log(orders);

      const products = orders.map(order => ({
        OrderID: order._id,
        UserID: order.user,
        ProductID: order.productDetails.product,
        paymentMethod: order.productDetails.method,
      }));

      // console.log(products);

      const data = {
        customize: {
          //  "template": fs.readFileSync('template.html', 'base64') // Must be base64 encoded html
        },
        images: {
          // The invoice background
          background: "",
        },
        // Your own data
        sender: {
          company: "COZA STORE",
          address: "Feel Your Spirit",
          city: "Bangalore",
          country: "India"
        },
        products: products,
        "bottom-notice": "Happy shopping and visit COZASTORE",
      };
      console.log(data);

      try {
        console.log("hello");
        let pdfResult = await easyinvoice.createInvoice(data);
        console.log("hiii");
      
        const pdfBuffer = Buffer.from(pdfResult.pdf, "base64");
      
        res.setHeader("Content-Disposition", 'attachment; filename="invoice.pdf"');
        res.setHeader("Content-Type", "application/pdf");
      
        const pdfStream = new Readable();
        pdfStream.push(pdfBuffer);
        pdfStream.push(null);
      
        pdfStream.pipe(res);
      } catch (error) {
        console.log("Error generating PDF:", error);
        res.status(500).json({ error: "Error generating PDF" });
      }
      
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  };







module.exports = {
    loadOrderDetails,
    orderDetails,
    changingStatus,
    salesReport,
    loadSalesReport,
    downloadInvoice 
}


