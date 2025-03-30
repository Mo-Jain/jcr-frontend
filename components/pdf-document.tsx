import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { 
      padding: 30, 
      fontSize: 12,
    },
    innerBorder: {
      padding:20,
      border: "1pt solid black",
      height: "100%",
    },
    outerBorder: {
      padding:1,
      border: "3pt solid black",
      height: "100%",
    },
    pageContent: {
      padding:20,
      border: "1pt solid black",
      height: "100%",
    },
    section: { 
      marginBottom: 10 
    },
    header: { 
      textAlign: "center", 
      fontSize: 18, 
      fontWeight: "bold", 
      marginBottom: 5 
    },
    subHeader: { 
      textAlign: "left", 
      color: "#2563eb", 
      fontSize: 12,
      fontWeight: "bold",
      marginBottom:5
    },
    logotext: { 
        textAlign: "left", 
        fontSize: 8,
        fontWeight: "bold"
      },
    textHeading: { 
      fontWeight: "bold" ,
      marginBottom:5,
      fontSize:14
    },
    bold:{
        fontWeight: "bold"
    },
    row: {
      flexDirection: "row", 
      justifyContent: "space-between", 
      marginBottom: 5,
      alignItems: "center"
    },
    logo: {
        flexDirection: "row", 
        marginBottom: 5,
        marginRight:3,
        alignItems: "center",
      },
    imageContainer: { 
      width: 80, 
      height: 50, 
      borderWidth: 1, 
      borderColor: "#000" 
    },
    image: { 
      width: "25px", 
      height: "25px" 
    },
    text: { 
      marginBottom: 3 
    },
    link: {
      color: "#2563eb",
      textDecoration: "underline"
    },
    divider: { 
      borderBottomWidth: 1, 
      borderBottomColor: "#ddd", 
      marginVertical: 10 
    },
    column: {
      flex: 1
    },
    termsSection: {
      marginTop: 10,
      marginBottom: 10
    },
    termsHeader: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 8
    },
    termsParagraph: {
      fontSize: 10,
      marginBottom: 6,
      lineHeight: 1.4
    },
    footer: {
      position: "absolute",
      bottom: 20,
      left: 20,
      right: 20,
      textAlign: "center",
      fontSize: 10,
      color: "#666"
    }
  });

 interface Booking {
  id: string;
  start: string;
  end: string;
  startTime: string;
  endTime: string;
  status: string;
  customerName: string;
  customerContact: string;
  carId: number;
  carName: string;
  carPlateNumber: string;
  dailyRentalPrice: number;
  securityDeposit?: string;
  totalPrice?: number;
  advancePayment?: number;
  customerAddress?: string;
  paymentMethod?: string;
  odometerReading?: string;
  notes?: string;
}

const PDFDocument = ({ booking }: { booking: Booking }) => {
  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getHeader = (
    status: string,
    startDate: string,
    startTime: string,
    endDate: string,
    endTime: string,
  ) => {
    let headerText = "";
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    startDateTime.setHours(startHour, startMinute, 0, 0);
    endDateTime.setHours(endHour, endMinute, 0, 0);
    const currDate = new Date();

    if (status === "Upcoming") {
      headerText = startDateTime >= currDate ? "Pickup scheduled on" : "Pickup was scheduled on";
    } else if (status === "Ongoing") {
      headerText = endDateTime < currDate ? "Return was scheduled on" : "Return scheduled by";
    } else if (status === "Completed") {
      headerText = "Booking ended at";
    }

    return headerText;
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
        <View style={styles.innerBorder}>
        <View style={styles.logo}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src="/favicon.png" style={styles.image} />
            <View style={{flexDirection:"column"}}>
                <Text style={styles.logotext}>Car</Text>
                <Text style={styles.logotext}>Rentals</Text>
            </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.header}>Car Rental Agreement</Text>
          <Text style={{...styles.subHeader,textAlign:"center"}}>Booking ID: {booking.id}</Text>
        </View>

        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
                <Text style={styles.text}>
                {getHeader(
                    booking.status,
                    booking.start,
                    booking.startTime,
                    booking.end,
                    booking.endTime,
                )}
                </Text>
                <Text style={styles.text}>
                {formatDateTime(
                    booking.status === "Upcoming" ? booking.start : booking.end,
                )}
                </Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.textHeading}>Vehicle Information</Text>
              <Text style={styles.text}>{booking.carName}</Text>
              <Text style={styles.text}>{booking.carPlateNumber}</Text>
            </View>
            
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.textHeading}>Booking Period</Text>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={{...styles.text,...styles.bold}}>From:</Text>
              <Text style={styles.text}>{formatDateTime(booking.start)} {booking.startTime}</Text>
            </View>
            <View style={styles.column}>
              <Text style={{...styles.text,...styles.bold}}>To:</Text>
              <Text style={styles.text}>{formatDateTime(booking.end)} {booking.endTime}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={styles.textHeading}>Customer Information</Text>
          <View style={styles.row}>
            <View>
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Name: </Text>
                    <Text style={styles.text}>{booking.customerName}</Text>
                </View>
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Contact: </Text>
                    <Text style={styles.text}>{booking.customerContact}</Text>
                </View>
            </View>
            <View >
                {booking.customerAddress && (
                    <View >
                        <Text style={{...styles.text,...styles.bold}}>Address: </Text>
                        <Text style={styles.text}>{booking.customerAddress}</Text>
                    </View>
                )}
            </View>
            <View>
                <Text></Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.section}>
        <Text style={styles.textHeading}>Payment Details</Text>
        <View style={styles.row}>
          <View>
            <View style={{display:"flex",flexDirection:"row"}}>
                <Text style={{...styles.text,...styles.bold}}>Daily Price: </Text>
                <Text style={styles.text}>{booking.dailyRentalPrice}</Text>
            </View>
            {booking.totalPrice && (
                <>
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Total Amount: </Text>
                    <Text style={styles.text}>{booking.totalPrice}</Text>
                </View>
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Balance Due: </Text>
                    <Text style={styles.text}>{booking.totalPrice - (booking.advancePayment || 0)}</Text>
                </View>
                </>
            )}
          </View>
          <View>
            {booking.advancePayment && (
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Advance Payment: </Text>
                    <Text style={styles.text}>{booking.advancePayment}</Text>
                </View>
            )}
            {booking.securityDeposit && (
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Security Deposit: </Text>
                    <Text style={styles.text}>{booking.securityDeposit}</Text>
                </View>
            )}
            {booking.paymentMethod && (
                <View style={{display:"flex",flexDirection:"row"}}>
                    <Text style={{...styles.text,...styles.bold}}>Payment Method: </Text>
                    <Text style={styles.text}>{booking.paymentMethod}</Text>
                </View>
            )}
          </View>
          <View>
            <Text></Text>
          </View>
        </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.section}>
          <Text style={styles.textHeading}>Some more details</Text>
          <View >
            <View>
              <View style={{display:"flex",flexDirection:"row"}}>
                  <Text style={{...styles.text,...styles.bold}}>Odometer Reading: </Text>
                  <Text style={styles.text}>{booking.odometerReading} km</Text>
              </View>
            </View>
            <View>
              {booking.notes && (
                  <View style={{display:"flex",flexDirection:"row"}}>
                      <Text style={{...styles.text,...styles.bold}}>Notes: </Text>
                      <Text style={styles.text}>{booking.notes}</Text>
                  </View>
              )}
            </View>
            <View>
              <Text></Text>
            </View>
          </View>
        </View>
        </View>
        </View>
        </Page>
        <Page size="A4" style={styles.page}>
        <View style={styles.outerBorder}>
        <View style={styles.innerBorder}>
        <View style={styles.section}>
          <Text style={styles.header}>Terms and Conditions</Text>
          
          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>1. Rental Term, Rate & Payment Mode</Text>
            <Text style={styles.termsParagraph}>
              The rental period shall commence on date and time mentioned above. The Vehicle is booked for these dates and times, Extension is subject to availability. The rental will be charged on an hourly/daily basis at the rate that have been decided.
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>2. Ownership & Use of vehicle</Text>
            <Text style={styles.termsParagraph}>
              The Lessee acknowledges that the Vehicle is the sole property of the Lessor. The Lessee has no ownership rights. The Lessee agrees to use the Vehicle solely for personal purposes. The Lessee shall not use the Vehicle for any business-related activities, including but not limited to ride-sharing, delivery services, or any commercial uses.
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>3. Prohibited Actions</Text>
            <Text style={styles.termsParagraph}>
              The Lessee shall not mortgage, sell, or otherwise encumber the Vehicle. Any such action shall be considered a breach of this Agreement and Legal action would be taken.
            </Text>
          </View>

          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>4. Maintenance and Care</Text>
            <Text style={styles.termsParagraph}>
              The Lessee agrees to maintain the Vehicle in good condition and return it in the same condition as received, normal wear and tear excepted. The Lessee shall be responsible for any damage to the Vehicle during the Rental Term.
            </Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>5. Indemnification & Governing Law</Text>
            <Text style={styles.termsParagraph}>
              The Lessee agrees to indemnify and hold harmless the Lessor from any and all claims, damages, losses, or expenses arising out of the Lessee&apos;s use of the Vehicle. This Agreement shall be governed by and construed in accordance with the laws of the state of Ahmedabad, Gujarat.
            </Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>6. Booking Duration</Text>
            <Text style={styles.termsParagraph}>
              No refunds will be issued for vehicles returned before the reserved date and time. However, hourly and daily rates will be applied to bookings that are extended beyond the original return time.
            </Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>7. Traffic Violation Challan</Text>
            <Text style={styles.termsParagraph}>
              This Agreement obligates you to pay any traffic violation fines incurred during your booking period, whenever they are presented.
            </Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsHeader}>8. Entire Agreement</Text>
            <Text style={styles.termsParagraph}>
              This Agreement constitutes the entire understanding between the parties and supersedes all prior discussions, agreements, or understandings, whether written or oral. The Lessor hereby agrees to rent to the Lessee the following vehicle.
            </Text>
          </View>
          <View style={styles.termsSection}>
            <Text style={styles.termsParagraph}>
              I accept all the terms and conditions stated above.
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <Text>© {new Date().getFullYear()} Jain Car Rentals. All rights reserved.</Text>
        </View>
        </View>
        </View>
      </Page>
    </Document>
  );
};

export default PDFDocument;