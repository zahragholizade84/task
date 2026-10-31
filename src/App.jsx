
import { useState, useEffect } from 'react';

function App() {
  const [user, setUser] = useState([]);
  const [loding, setLoding] = useState(true);
  const [error, setError] = useState(null);
  const [searchterm, setsearchterm] = useState('');
  const [selectedcity, setselectedcity] = useState('all city');
  const [sortOrder, setSortOrder] = useState('asc');
  //نگداری model
  const [useropen, setuseropen] = useState(false);
  const [selectedUser, setselectedUser] = useState(null);

  // دریافت اطلاعات کاربران از API
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        );

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        setError('Failed to load users. Please try again.');
      } finally {
        setLoding(false);
      }
    };

    fetchUser();
  }, []);

  // جست‌وجو بر اساس نام، نام کاربری و ایمیل
  const filtersearch = user.filter((item) => {
    const search = searchterm.toLowerCase();

    return (
      item.name.toLowerCase().includes(search) ||
      item.username.toLowerCase().includes(search) ||
      item.email.toLowerCase().includes(search)
    );
  });

  // ساخت لیست شهرهای بدون تکرار
  const cities = [
    ...new Set(user.map((item) => item.address.city)),
  ];

  // فیلتر کردن کاربران بر اساس شهر انتخاب‌شده
  const filteredUsers = filtersearch.filter((item) => {
    return (
      selectedcity === 'all city' ||
      item.address.city === selectedcity
    );
  });

  // مرتب‌سازی کاربران بر اساس نام
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    return sortOrder === 'asc'
      ? a.name.localeCompare(b.name)
      : b.name.localeCompare(a.name);
  });

  return (
    <div className="dashboard-header">
  <h1>User Dashboard</h1>
  <p>Manage and explore your users in one place.</p>


      {/* کادر جست‌وجو */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name, username or email..."
        value={searchterm}
        onChange={(e) => setsearchterm(e.target.value)}
      />

      <div className="row mb-3">
        {/* فیلتر شهر */}
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={selectedcity}
            onChange={(e) => setselectedcity(e.target.value)}
          >
            <option value="all city">All Cities</option>

            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* مرتب‌سازی نام */}
        <div className="col-md-6 mb-2">
          <select
            className="form-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Name: A to Z</option>
            <option value="desc">Name: Z to A</option>
          </select>
        </div>
      </div>

      {/* حالت بارگذاری */}
      {loding && (
        <p className="text-center">Loading users...</p>
      )}

      {/* نمایش خطا */}
      {!loding && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* نمایش کاربران */}
      {!loding && !error && (
        <>
          <p className="text-muted">
            Total users: {sortedUsers.length}
          </p>

          <div className="row">
            {sortedUsers.length > 0 ? (
              sortedUsers.map((item) => (
                <div
                  className="col-12 col-sm-6 col-lg-4 mb-3"
                  key={item.id}
                >
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">
                        {item.name}
                      </h5>

                      <p className="card-text">
                        <strong>Username:</strong>{' '}
                        {item.username}
                      </p>
                      <p className="card-text">
                        <strong>Email:</strong>{' '}
                        <a href={`mailto:${item.email}`}>
                          {item.email}
                        </a>
                      </p>

                      <p className="card-text">
                        <strong>Company:</strong>{' '}
                        {item.company.name}
                      </p>

                      <p className="card-text">
                        <strong>City:</strong>{' '}
                        {item.address.city}
                      </p>

                      <button
                        className="btn 
                         btn-primary"
                        onClick={() => {
                          setselectedUser(item);
                          setuseropen(true);
                        }}
                      >
                        view Details
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12">
                <p className="text-center">
                  No users found.
                </p>
              </div>
            )}
          </div>
        </>
      )}
      {useropen && selectedUser && (
        <div
          className="modal d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            inset: 0,
            zIndex: 1055,
            overflowY: 'auto'
          }}
          onClick={() => setuseropen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {selectedUser.name}
                </h5>

                <button
                  className="btn-close"
                  type="button"
                  aria-label="Close"
                  onClick={() => setuseropen(false)}
                />
              </div>

              <div className="modal-body">
                <p>
                  <strong>Email:</strong>{' '}
                  {selectedUser.email}
                </p>

                <p>
                  <strong>Phone:</strong>{' '}
                  {selectedUser.phone}
                </p>

                <p>
                  <strong>Website:</strong>{' '}
                  <a
                    href={`https://${selectedUser.website}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {selectedUser.website}
                  </a>
                </p>

                <hr />

                <h6>Address</h6>

                <p>
                  <strong>Street:</strong>{' '}
                  {selectedUser.address.street}
                </p>

                <p>
                  <strong>Suite:</strong>{' '}
                  {selectedUser.address.suite}
                </p>

                <p>
                  <strong>City:</strong>{' '}
                  {selectedUser.address.city}
                </p>

                <p>
                  <strong>Zipcode:</strong>{' '}
                  {selectedUser.address.zipcode}
                </p>

                <hr />

                <h6>Company</h6>

                <p>
                  <strong>Name:</strong>{' '}
                  {selectedUser.company.name}
                </p>

                <p>
                  <strong>Catch Phrase:</strong>{' '}
                  {selectedUser.company.catchPhrase}
                </p>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setuseropen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;