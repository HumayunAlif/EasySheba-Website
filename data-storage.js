const easysheba = {
    // Initialize data if not exists - NO FAKE USERS
    init: function() {
        console.log('Initializing EasySheba Data Storage...');
        
        // Initialize empty arrays if not exists
        if (!localStorage.getItem('users')) {
            localStorage.setItem('users', JSON.stringify([]));
            console.log('Users storage initialized');
        }

        if (!localStorage.getItem('services')) {
            const services = [
                { 
                    id: 1, 
                    name: 'Electrical Services', 
                    category: 'electrician', 
                    icon: '⚡', 
                    description: 'All electrical repair and installation',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 2, 
                    name: 'Plumbing Services', 
                    category: 'plumber', 
                    icon: '🚿', 
                    description: 'Pipe repair, installation and maintenance',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 3, 
                    name: 'Cleaning Services', 
                    category: 'cleaner', 
                    icon: '🧹', 
                    description: 'Home and office cleaning',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 4, 
                    name: 'AC Repair Services', 
                    category: 'ac-repair', 
                    icon: '❄️', 
                    description: 'AC installation and repair',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 5, 
                    name: 'Painting Services', 
                    category: 'painter', 
                    icon: '🎨', 
                    description: 'Wall painting and decoration',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 6, 
                    name: 'Carpentry Services', 
                    category: 'carpenter', 
                    icon: '🪚', 
                    description: 'Furniture repair and making',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 7, 
                    name: 'Gardening Services', 
                    category: 'gardener', 
                    icon: '🌿', 
                    description: 'Garden maintenance and landscaping',
                    status: 'active',
                    createdAt: new Date().toISOString()
                },
                { 
                    id: 8, 
                    name: 'Mechanic Services', 
                    category: 'mechanic', 
                    icon: '🔧', 
                    description: 'Vehicle repair and maintenance',
                    status: 'active',
                    createdAt: new Date().toISOString()
                }
            ];
            localStorage.setItem('services', JSON.stringify(services));
            console.log('Default services added');
        }

        if (!localStorage.getItem('bookings')) {
            localStorage.setItem('bookings', JSON.stringify([]));
            console.log('Bookings storage initialized');
        }

        if (!localStorage.getItem('chats')) {
            localStorage.setItem('chats', JSON.stringify([]));
            console.log('Chats storage initialized');
        }

        if (!localStorage.getItem('offers')) {
            localStorage.setItem('offers', JSON.stringify([]));
            console.log('Offers storage initialized');
        }

        if (!localStorage.getItem('reviews')) {
            localStorage.setItem('reviews', JSON.stringify([]));
            console.log('Reviews storage initialized');
        }

        if (!localStorage.getItem('notifications')) {
            localStorage.setItem('notifications', JSON.stringify([]));
            console.log('Notifications storage initialized');
        }

        // Always create admin user if not exists
        this.createAdminUser();
        
        console.log('EasySheba initialization complete!');
    },

    // Create admin user if not exists
    createAdminUser: function() {
        const users = this.getUsers();
        const adminExists = users.some(user => user.email === 'admin@easysheba.com');
        
        if (!adminExists) {
            const adminUser = {
                id: 1,
                firstName: 'Admin',
                lastName: 'User',
                email: 'admin@easysheba.com',
                phone: '01700000000',
                password: 'admin123',
                userType: 'admin',
                isVerified: true,
                createdAt: new Date().toISOString(),
                isActive: true,
                earnings: 0,
                profileImage: null,
                lastLogin: null,
                permissions: ['all']
            };
            
            users.push(adminUser);
            localStorage.setItem('users', JSON.stringify(users));
            console.log('Admin user created automatically');
        }
    },

    // ============ USER MANAGEMENT ============
    getUsers: function() {
        try {
            const users = JSON.parse(localStorage.getItem('users')) || [];
            return users;
        } catch (error) {
            console.error('Error parsing users:', error);
            return [];
        }
    },

    getUserById: function(id) {
        const users = this.getUsers();
        return users.find(user => user.id === parseInt(id));
    },

    getUserByEmail: function(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    },

    addUser: function(user) {
        const users = this.getUsers();
        
        // Check if email already exists
        if (this.getUserByEmail(user.email)) {
            throw new Error('Email already registered');
        }
        
        // Generate new ID
        const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        
        const newUser = {
            id: newId,
            ...user,
            createdAt: new Date().toISOString(),
            isVerified: user.userType === 'admin' ? true : false,
            isActive: true,
            earnings: user.earnings || 0,
            profileImage: null,
            lastLogin: null,
            permissions: [],
            rating: 0,
            totalBookings: 0,
            totalEarnings: 0,
            totalReviews: 0,
            serviceCategory: user.serviceCategory || null,
            hourlyRate: user.hourlyRate || 500
        };
        
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        console.log(`New user registered: ${newUser.email} (${newUser.userType})`);
        return newUser;
    },

    updateUser: function(userId, updates) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === parseInt(userId));
        
        if (index !== -1) {
            // Update user data
            users[index] = { ...users[index], ...updates };
            
            // Update last modified timestamp
            users[index].updatedAt = new Date().toISOString();
            
            localStorage.setItem('users', JSON.stringify(users));
            console.log(`User ${userId} updated successfully`);
            return true;
        }
        
        console.error(`User ${userId} not found for update`);
        return false;
    },

    deleteUser: function(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== parseInt(userId));
        
        if (filteredUsers.length !== users.length) {
            localStorage.setItem('users', JSON.stringify(filteredUsers));
            console.log(`User ${userId} deleted successfully`);
            return true;
        }
        
        return false;
    },

    // User Statistics
    getUserStats: function() {
        const users = this.getUsers();
        const allUsers = users.filter(u => u.userType !== 'admin');
        const today = new Date().toDateString();
        
        return {
            total: allUsers.length,
            customers: allUsers.filter(u => u.userType === 'customer').length,
            providers: allUsers.filter(u => u.userType === 'provider').length,
            active: allUsers.filter(u => u.isActive).length,
            verified: allUsers.filter(u => u.isVerified).length,
            today: allUsers.filter(u => {
                const userDate = new Date(u.createdAt).toDateString();
                return today === userDate;
            }).length,
            // Last 7 days growth
            last7Days: this.getUserGrowth(7),
            // Last 30 days growth
            last30Days: this.getUserGrowth(30)
        };
    },

    getUserGrowth: function(days) {
        const users = this.getUsers().filter(u => u.userType !== 'admin');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        return users.filter(u => new Date(u.createdAt) >= cutoffDate).length;
    },

    // ============ SERVICE MANAGEMENT ============
    getServices: function() {
        try {
            const services = JSON.parse(localStorage.getItem('services')) || [];
            return services;
        } catch (error) {
            console.error('Error parsing services:', error);
            return [];
        }
    },

    getServiceById: function(id) {
        const services = this.getServices();
        return services.find(service => service.id === parseInt(id));
    },

    getServiceByCategory: function(category) {
        const services = this.getServices();
        return services.find(service => service.category === category);
    },

    addService: function(service) {
        const services = this.getServices();
        const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
        
        const newService = {
            id: newId,
            ...service,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            popularity: 0,
            totalBookings: 0
        };
        
        services.push(newService);
        localStorage.setItem('services', JSON.stringify(services));
        
        console.log(`New service added: ${newService.name}`);
        return newService;
    },

    updateService: function(serviceId, updates) {
        const services = this.getServices();
        const index = services.findIndex(service => service.id === parseInt(serviceId));
        
        if (index !== -1) {
            services[index] = { ...services[index], ...updates };
            services[index].updatedAt = new Date().toISOString();
            
            localStorage.setItem('services', JSON.stringify(services));
            console.log(`Service ${serviceId} updated successfully`);
            return true;
        }
        
        return false;
    },

    deleteService: function(serviceId) {
        const services = this.getServices();
        const filteredServices = services.filter(service => service.id !== parseInt(serviceId));
        
        if (filteredServices.length !== services.length) {
            localStorage.setItem('services', JSON.stringify(filteredServices));
            console.log(`Service ${serviceId} deleted successfully`);
            return true;
        }
        
        return false;
    },

    // ============ PROVIDER MANAGEMENT ============
    getProviders: function() {
        const users = this.getUsers();
        return users.filter(user => user.userType === 'provider');
    },

    getProvidersByCategory: function(category) {
        const providers = this.getProviders();
        return providers.filter(provider => 
            provider.serviceCategory === category && 
            provider.isVerified === true && 
            provider.isActive === true
        );
    },

    verifyProvider: function(providerId) {
        const success = this.updateUser(providerId, { 
            isVerified: true,
            verifiedAt: new Date().toISOString()
        });
        
        if (success) {
            this.addNotification({
                userId: providerId,
                title: 'Account Verified',
                message: 'Your provider account has been verified by admin. You can now receive job requests.',
                type: 'success',
                isRead: false
            });
        }
        
        return success;
    },

    getProviderStats: function(providerId) {
        const provider = this.getUserById(providerId);
        if (!provider || provider.userType !== 'provider') return null;
        
        const bookings = this.getBookingsByProvider(providerId);
        const completedBookings = bookings.filter(b => b.status === 'completed');
        const reviews = this.getReviewsByProvider(providerId);
        
        return {
            totalJobs: bookings.length,
            completedJobs: completedBookings.length,
            pendingJobs: bookings.filter(b => b.status === 'pending').length,
            activeJobs: bookings.filter(b => b.status === 'confirmed' || b.status === 'assigned').length,
            totalEarnings: completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            averageRating: reviews.length > 0 ? 
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0,
            totalReviews: reviews.length,
            responseRate: this.calculateResponseRate(providerId),
            satisfactionRate: this.calculateSatisfactionRate(providerId)
        };
    },

    calculateResponseRate: function(providerId) {
        const bookings = this.getBookingsByProvider(providerId);
        if (bookings.length === 0) return 0;
        
        const respondedBookings = bookings.filter(b => 
            b.status !== 'pending' && b.status !== 'cancelled'
        ).length;
        
        return Math.round((respondedBookings / bookings.length) * 100);
    },

    calculateSatisfactionRate: function(providerId) {
        const reviews = this.getReviewsByProvider(providerId);
        if (reviews.length === 0) return 0;
        
        const positiveReviews = reviews.filter(r => r.rating >= 4).length;
        return Math.round((positiveReviews / reviews.length) * 100);
    },

    // ============ BOOKING MANAGEMENT ============
    getBookings: function() {
        try {
            const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
            return bookings;
        } catch (error) {
            console.error('Error parsing bookings:', error);
            return [];
        }
    },

    getBookingById: function(id) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.id === parseInt(id));
    },

    getBookingByCode: function(bookingCode) {
        const bookings = this.getBookings();
        return bookings.find(booking => booking.bookingCode === bookingCode);
    },

    // Unique booking code generator
    generateBookingCode: function() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'ESB';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        
        // Check if code already exists
        const existingBookings = this.getBookings();
        const codeExists = existingBookings.some(b => b.bookingCode === code);
        
        if (codeExists) {
            // Recursively generate new code if exists
            return this.generateBookingCode();
        }
        
        return code;
    },

    addBooking: function(bookingData) {
        try {
            const bookings = this.getBookings();
            const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id)) + 1 : 1;
            
            // Generate unique booking code
            const bookingCode = this.generateBookingCode();
            
            const newBooking = {
                id: newId,
                ...bookingData,
                bookingCode: bookingCode,
                status: bookingData.status || 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                paymentStatus: 'pending',
                isPaid: false,
                paymentMethod: null,
                paymentDate: null,
                providerAccepted: false,
                providerAcceptedAt: null,
                jobStartedAt: null,
                jobCompletedAt: null,
                customerRated: false,
                providerRated: false
            };
            
            bookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(bookings));
            
            console.log('New booking created:', newBooking);
            
            // Add notification for provider
            this.addNotification({
                userId: bookingData.providerId,
                title: 'New Job Request',
                message: `You have a new booking request from ${bookingData.customerName || 'a customer'}.`,
                type: 'info',
                bookingId: newBooking.id,
                isRead: false
            });
            
            return newBooking;
        } catch (error) {
            console.error('Error in addBooking:', error);
            return null;
        }
    },

    updateBookingStatus: function(bookingCode, newStatus) {
        const bookings = this.getBookings();
        let index = -1;
        
        // Find booking by code or id
        index = bookings.findIndex(b => b.bookingCode === bookingCode);
        
        if (index === -1) {
            index = bookings.findIndex(b => 
                b.id === parseInt(bookingCode) || 
                b.id.toString() === bookingCode
            );
        }
        
        if (index !== -1) {
            const oldStatus = bookings[index].status;
            bookings[index].status = newStatus;
            bookings[index].updatedAt = new Date().toISOString();
            
            // Set timestamps based on status
            if (newStatus === 'confirmed') {
                bookings[index].providerAccepted = true;
                bookings[index].providerAcceptedAt = new Date().toISOString();
                
                // Notify customer
                this.addNotification({
                    userId: bookings[index].customerId,
                    title: 'Booking Confirmed',
                    message: `Provider has accepted your booking request.`,
                    type: 'success',
                    bookingId: bookings[index].id,
                    isRead: false
                });
            }
            else if (newStatus === 'assigned') {
                bookings[index].jobStartedAt = new Date().toISOString();
            }
            else if (newStatus === 'completed') {
                bookings[index].jobCompletedAt = new Date().toISOString();
                
                // Update provider earnings
                const booking = bookings[index];
                const provider = this.getUserById(booking.providerId);
                if (provider) {
                    const newEarnings = (provider.earnings || 0) + (booking.totalAmount || 0);
                    this.updateUser(provider.id, { 
                        earnings: newEarnings,
                        totalEarnings: (provider.totalEarnings || 0) + (booking.totalAmount || 0)
                    });
                    
                    // Update provider stats
                    const providerStats = this.getProviderStats(provider.id);
                    this.updateUser(provider.id, {
                        totalBookings: providerStats.totalJobs,
                        completedJobs: providerStats.completedJobs
                    });
                }
                
                // Notify customer
                this.addNotification({
                    userId: booking.customerId,
                    title: 'Job Completed',
                    message: `Your service has been completed successfully.`,
                    type: 'success',
                    bookingId: booking.id,
                    isRead: false
                });
            }
            
            localStorage.setItem('bookings', JSON.stringify(bookings));
            console.log(`Booking ${bookingCode} status changed from ${oldStatus} to ${newStatus}`);
            return true;
        }
        
        console.error(`Booking ${bookingCode} not found for status update`);
        return false;
    },

    getBookingsByCustomer: function(customerId) {
        const bookings = this.getBookings();
        return bookings.filter(booking => booking.customerId === parseInt(customerId));
    },

    getBookingsByProvider: function(providerId) {
        const bookings = this.getBookings();
        return bookings.filter(booking => booking.providerId === parseInt(providerId));
    },

    getBookingStats: function() {
        const bookings = this.getBookings();
        const completedBookings = bookings.filter(b => b.status === 'completed');
        
        return {
            total: bookings.length,
            pending: bookings.filter(b => b.status === 'pending').length,
            confirmed: bookings.filter(b => b.status === 'confirmed').length,
            assigned: bookings.filter(b => b.status === 'assigned').length,
            completed: completedBookings.length,
            cancelled: bookings.filter(b => b.status === 'cancelled').length,
            totalEarnings: completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
            today: bookings.filter(b => {
                const today = new Date().toDateString();
                const bookingDate = new Date(b.createdAt).toDateString();
                return today === bookingDate;
            }).length,
            // Last 7 days bookings
            last7Days: bookings.filter(b => {
                const cutoffDate = new Date();
                cutoffDate.setDate(cutoffDate.getDate() - 7);
                return new Date(b.createdAt) >= cutoffDate;
            }).length,
            // Average booking amount
            averageAmount: completedBookings.length > 0 ? 
                completedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0) / completedBookings.length : 0
        };
    },

    // ============ CHAT AND OFFERS ============
    addOffer: function(offer) {
        const offers = JSON.parse(localStorage.getItem('offers')) || [];
        
        const newOffer = {
            ...offer,
            id: offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1,
            createdAt: new Date().toISOString(),
            status: 'pending',
            isRead: false
        };
        
        offers.push(newOffer);
        localStorage.setItem('offers', JSON.stringify(offers));
        
        // Add notification
        this.addNotification({
            userId: offer.toUserId,
            title: 'New Price Offer',
            message: `You have received a price offer for a service.`,
            type: 'info',
            offerId: newOffer.id,
            isRead: false
        });
        
        return true;
    },

    getOffers: function() {
        return JSON.parse(localStorage.getItem('offers')) || [];
    },

    addChatMessage: function(chatId, message) {
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        let chat = chats.find(c => c.chatId === chatId);
        
        if (!chat) {
            chat = { 
                chatId, 
                messages: [],
                participants: message.participants || [],
                createdAt: new Date().toISOString(),
                lastMessageAt: new Date().toISOString()
            };
            chats.push(chat);
        }
        
        chat.messages.push({
            ...message,
            messageId: chat.messages.length + 1,
            timestamp: new Date().toISOString(),
            isRead: false
        });
        
        chat.lastMessageAt = new Date().toISOString();
        localStorage.setItem('chats', JSON.stringify(chats));
        
        return true;
    },

    getChatMessages: function(chatId) {
        const chats = JSON.parse(localStorage.getItem('chats')) || [];
        const chat = chats.find(c => c.chatId === chatId);
        return chat ? chat.messages : [];
    },

    // ============ REVIEWS ============
    addReview: function(review) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        
        const newReview = {
            ...review,
            id: reviews.length > 0 ? Math.max(...reviews.map(r => r.id)) + 1 : 1,
            createdAt: new Date().toISOString(),
            isVerified: false,
            helpfulCount: 0
        };
        
        reviews.push(newReview);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        
        // Update provider rating
        this.updateProviderRating(review.providerId);
        
        return newReview;
    },

    getReviewsByProvider: function(providerId) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        return reviews.filter(r => r.providerId === parseInt(providerId));
    },

    updateProviderRating: function(providerId) {
        const reviews = this.getReviewsByProvider(providerId);
        if (reviews.length === 0) return;
        
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / reviews.length;
        
        this.updateUser(providerId, {
            rating: Math.round(averageRating * 10) / 10,
            totalReviews: reviews.length
        });
    },

    // ============ NOTIFICATIONS ============
    addNotification: function(notification) {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        
        const newNotification = {
            ...notification,
            id: notifications.length > 0 ? Math.max(...notifications.map(n => n.id)) + 1 : 1,
            createdAt: new Date().toISOString()
        };
        
        notifications.push(newNotification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        return newNotification;
    },

    getNotificationsByUser: function(userId) {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        return notifications
            .filter(n => n.userId === parseInt(userId))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    },

    markNotificationAsRead: function(notificationId) {
        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        const index = notifications.findIndex(n => n.id === parseInt(notificationId));
        
        if (index !== -1) {
            notifications[index].isRead = true;
            notifications[index].readAt = new Date().toISOString();
            localStorage.setItem('notifications', JSON.stringify(notifications));
            return true;
        }
        
        return false;
    },

    // ============ ANALYTICS & DASHBOARD ============
    getDashboardStats: function() {
        return {
            users: this.getUserStats(),
            bookings: this.getBookingStats(),
            providers: {
                total: this.getProviders().length,
                verified: this.getProviders().filter(p => p.isVerified).length,
                active: this.getProviders().filter(p => p.isActive).length,
                topEarners: this.getTopEarningProviders(5)
            },
            services: {
                total: this.getServices().length,
                popular: this.getPopularServices(5)
            }
        };
    },

    getTopEarningProviders: function(limit = 5) {
        const providers = this.getProviders();
        return providers
            .map(provider => ({
                ...provider,
                earnings: provider.earnings || 0,
                stats: this.getProviderStats(provider.id)
            }))
            .sort((a, b) => b.earnings - a.earnings)
            .slice(0, limit);
    },

    getPopularServices: function(limit = 5) {
        const services = this.getServices();
        const bookings = this.getBookings();
        
        // Count bookings per service category
        const serviceCounts = {};
        bookings.forEach(booking => {
            const provider = this.getUserById(booking.providerId);
            if (provider && provider.serviceCategory) {
                serviceCounts[provider.serviceCategory] = (serviceCounts[provider.serviceCategory] || 0) + 1;
            }
        });
        
        return services
            .map(service => ({
                ...service,
                bookingCount: serviceCounts[service.category] || 0
            }))
            .sort((a, b) => b.bookingCount - a.bookingCount)
            .slice(0, limit);
    },

    // ============ UTILITY FUNCTIONS ============
    resetAllData: function() {
        if (confirm('Are you sure you want to reset ALL data? This cannot be undone.')) {
            localStorage.removeItem('users');
            localStorage.removeItem('bookings');
            localStorage.removeItem('chats');
            localStorage.removeItem('offers');
            localStorage.removeItem('reviews');
            localStorage.removeItem('notifications');
            
            // Keep services
            const services = this.getServices();
            localStorage.setItem('services', JSON.stringify(services));
            
            this.init();
            console.log('All data reset to initial state');
            return true;
        }
        return false;
    },

    exportData: function() {
        const data = {
            users: this.getUsers(),
            services: this.getServices(),
            bookings: this.getBookings(),
            chats: JSON.parse(localStorage.getItem('chats')) || [],
            offers: JSON.parse(localStorage.getItem('offers')) || [],
            reviews: JSON.parse(localStorage.getItem('reviews')) || [],
            notifications: JSON.parse(localStorage.getItem('notifications')) || [],
            exportedAt: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `easysheba-backup-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        console.log('Data exported successfully');
        return true;
    },

    importData: function(jsonData) {
        try {
            const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
            
            if (data.users) localStorage.setItem('users', JSON.stringify(data.users));
            if (data.services) localStorage.setItem('services', JSON.stringify(data.services));
            if (data.bookings) localStorage.setItem('bookings', JSON.stringify(data.bookings));
            if (data.chats) localStorage.setItem('chats', JSON.stringify(data.chats));
            if (data.offers) localStorage.setItem('offers', JSON.stringify(data.offers));
            if (data.reviews) localStorage.setItem('reviews', JSON.stringify(data.reviews));
            if (data.notifications) localStorage.setItem('notifications', JSON.stringify(data.notifications));
            
            console.log('Data imported successfully');
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    },

    // ============ BACKUP & RECOVERY ============
    createBackup: function() {
        const backup = {
            users: this.getUsers(),
            services: this.getServices(),
            bookings: this.getBookings(),
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        
        localStorage.setItem('easysheba_backup', JSON.stringify(backup));
        console.log('Backup created successfully');
        return backup;
    },

    restoreBackup: function() {
        const backup = JSON.parse(localStorage.getItem('easysheba_backup'));
        if (!backup) {
            console.error('No backup found');
            return false;
        }
        
        if (confirm('Restore from backup? Current data will be overwritten.')) {
            this.importData(backup);
            console.log('Backup restored successfully');
            return true;
        }
        
        return false;
    }
};

// Initialize data when script loads
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        easysheba.init();
    });
}

// Make easysheba globally available
if (typeof window !== 'undefined') {
    window.easysheba = easysheba;
}