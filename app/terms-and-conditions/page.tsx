export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-blue-200 dark:bg-[#181818] text-primary-foreground py-8">
        <div className="container mx-auto px-4 whitespace-nowrap">
          <div className="flex flex-col items-center justify-center text-center text-black dark:text-white">
            <h1 className="text-2xl sm:text-4xl font-bold mb-2">
              Terms and Conditions
            </h1>
            <p className="text-md sm:text-lg">Jain Car Rentals</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 bg-background">
        <div className="max-w-4xl mx-auto bg-muted rounded-lg shadow-sm border border-border p-4 sm:p-8">
          <div className="prose max-w-none">
            <div className="space-y-8">
              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  1. Rental Term, Rate & Payment Mode
                </h2>
                <p className="text-sm sm:text-md">
                  The rental period shall commence on date and time mentioned
                  above. The Vehicle is booked for these dates and times,
                  Extension is subject to availability.
                </p>
                <p className="text-sm sm:text-md">
                  The rental will be charged on an hourly/daily basis at the
                  rate that have been decided.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  2. Ownership & Use of vehicle
                </h2>
                <p className="text-sm sm:text-md">
                  The Lessee acknowledges that the Vehicle is the sole property
                  of the Lessor. The Lessee has no ownership rights.
                </p>
                <p className="text-sm sm:text-md">
                  The Lessee agrees to use the Vehicle solely for personal
                  purposes. The Lessee shall not use the Vehicle for any
                  business-related activities, including but not limited to
                  ride-sharing, delivery services, or any commercial uses.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  3. Prohibited Actions
                </h2>
                <p className="text-sm sm:text-md">
                  The Lessee shall not mortgage, sell, or otherwise encumber the
                  Vehicle. Any such action shall be considered a breach of this
                  Agreement and Legal action would be taken.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  4. Maintenance and Care
                </h2>
                <p className="text-sm sm:text-md">
                  The Lessee agrees to maintain the Vehicle in good condition
                  and return it in the same condition as received, normal wear
                  and tear excepted. The Lessee shall be responsible for any
                  damage to the Vehicle during the Rental Term.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  5. Indemnification & Governing Law
                </h2>
                <p className="text-sm sm:text-md">
                  The Lessee agrees to indemnify and hold harmless the Lessor
                  from any and all claims, damages, losses, or expenses arising
                  out of the Lessee&apos;s use of the Vehicle. This Agreement
                  shall be governed by and construed in accordance with the laws
                  of the state of Ahmedabad, Gujarat.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  6. Booking Duration
                </h2>
                <p className="text-sm sm:text-md">
                  No refunds will be issued for vehicles returned before the
                  reserved date and time. However, hourly and daily rates will
                  be applied to bookings that are extended beyond the original
                  return time.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  7. Traffic Violation Challan
                </h2>
                <p className="text-sm sm:text-md">
                  This Agreement obligates you to pay any traffic violation
                  fines incurred during your booking period, whenever they are
                  presented.
                </p>
              </section>

              <section>
                <h2 className="text-md sm:text-lg font-bold mb-3">
                  8. Entire Agreement
                </h2>
                <p className="text-sm sm:text-md">
                  This Agreement constitutes the entire understanding between
                  the parties and supersedes all prior discussions, agreements,
                  or understandings, whether written or oral. The Lessor hereby
                  agrees to rent to the Lessee the following vehicle.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-muted py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Jain Car Rentals. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
