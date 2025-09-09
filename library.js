builder.add('components','stepper', class extends builder.ComponentClass {

    #current = 1;
    #isAnimating = false;
    #pendingTarget = null;
    _steps = {};

    _init(){
        this._properties = {
            class: {
                component: null,
                controls: null,
                controlsList: null,
                control: null,
                mobile: null,
                content: null,
                steps: null,
                pagination: null,
            },
            showFirst: true,
            callback: {},
        };
    }

    _create(){

        // Set Self
        const self = this;

        // Create Component
        this._component = $(document.createElement('div')).attr({
            'id': 'stepper' + this._id,
            'class': 'stepper',
        });
        this._component.id = this._component.attr('id');

        // Create Controls
        this._component.controls = $(document.createElement('div')).addClass('stepper-controls').appendTo(this._component);
        this._component.progress = $(document.createElement('div')).attr({
            'class':'progress d-none d-lg-flex',
            'role':'progressbar',
            'aria-label':'Progress',
            'aria-valuemin':'0',
            'aria-valuemax':'100'
        }).appendTo(this._component.controls);
        this._component.progress.bar = $(document.createElement('div')).attr({
            'class':'progress-bar progress-bar-striped progress-bar-animated stepper-progress',
        }).appendTo(this._component.progress);
        this._component.controls.list = $(document.createElement('div')).attr({
            'class':'stepper-controls-list d-none d-lg-flex',
            'id':this._component.id + 'controls',
        }).appendTo(this._component.controls);
        this._component.controls.id = this._component.controls.list.attr('id');

        // Create Mobile Tabs Nav
        this._component.controls.mobile = $(document.createElement('div')).attr({
            'class':'stepper-controls-mobile btn-group w-100 d-flex d-lg-none',
        }).appendTo(this._component.controls);
        this._component.controls.mobile.current = $(document.createElement('button')).attr({
            'type': 'button',
            'class': 'btn btn-primary dropdown-toggle',
            'data-bs-toggle': 'dropdown',
            'aria-expanded': 'false',
        }).appendTo(this._component.controls.mobile);
        this._component.controls.mobile.menu = $(document.createElement('ul')).addClass('dropdown-menu').appendTo(this._component.controls.mobile);

        // Create Steps
        this._component.steps = $(document.createElement('div')).addClass('stepper-steps').appendTo(this._component);
        this._component.steps.accordion = $(document.createElement('div')).attr({
            'class':'accordion',
            'id':this._component.id + 'steps',
            'role':'tablist',
        }).appendTo(this._component.steps);
        this._component.steps.id = this._component.steps.accordion.attr('id');

        // Create Pagination
        this._component.pagination = $(document.createElement('div')).attr({
            'class':'stepper-pagination',
            'id':this._component.id + 'pagination',
        }).appendTo(this._component);
        this._component.pagination.previous = $(document.createElement('button')).attr({
            'class':'btn btn-primary',
            'type':'button',
            'data-bs-toggle':'collapse',
        }).text(this._builder.Locale.get('Previous')).appendTo(this._component.pagination);
        this._component.pagination.previous.icon = $(document.createElement('i')).addClass('bi bi-chevron-left me-2').prependTo(this._component.pagination.previous);
        this._component.pagination.next = $(document.createElement('button')).attr({
            'class':'btn btn-primary',
            'type':'button',
            'data-bs-toggle':'collapse',
        }).text(this._builder.Locale.get('Next')).appendTo(this._component.pagination);
        this._component.pagination.next.icon = $(document.createElement('i')).addClass('bi bi-chevron-right ms-2').appendTo(this._component.pagination.next);

        // Set Component Class
        if(this._properties.class.component){
            this._component.addClass(this._properties.class.component);
        }

        // Set Controls Class
        if(this._properties.class.controls){
            this._component.controls.addClass(this._properties.class.controls);
        }

        // Set Controls Class
        if(this._properties.class.controlsList){
            this._component.controls.list.addClass(this._properties.class.controlsList);
        }

        // Set Steps Class
        if(this._properties.class.steps){
            this._component.steps.addClass(this._properties.class.steps);
        }

        // Set Pagination Class
        if(this._properties.class.pagination){
            this._component.pagination.addClass(this._properties.class.pagination);
        }

        // Wire Sequential Accordion Behavior
        setTimeout(() => this.#wireSequentialAccordion(), 100);
    }

    add(param1 = null, param2 = null){

        // Set Self
        const self = this;

        let options = {};
        let callback = null;

        // Set selector, options, and callback
        [param1, param2].forEach(param => {
            if(param !== null){
                if (typeof param === 'object') {
                    options = param;
                } else if (typeof param === 'function') {
                    callback = param;
                }
            }
        });

        let properties = {
            class: {
                control: null,
                mobile: null,
                content: null,
            },
            label: null,
            icon: null,
            color: null,
            tooltip: null,
            numbered: false,
            callback: {
                hide: null,
                hidden: null,
                show: null,
                shown: null,
            },
        };

        // Configure Options
        for(const [key, value] of Object.entries(options)){
            if(typeof properties[key] !== 'undefined'){
                switch(key){
                    case"callback":
                        if(typeof properties[key] !== 'undefined'){
                            for(const [k, v] of Object.entries(value)){
                                if(typeof properties[key][k] !== 'undefined'){
                                    properties[key][k] = v;
                                }
                            }
                        }
                        break;
                    case"class":
                        for(const [section, classes] of Object.entries(value)){
                            if(properties[key][section] != null){
                                properties[key][section] += ' ' + classes;
                            } else {
                                properties[key][section] = classes;
                            }
                        }
                        break;
                    default:
                        properties[key] = value;
                        break;
                }
            }
        }

        // Set ID
        let id = this._count();

        // Create Step Control
        let control = $(document.createElement('button')).attr({
            'id':this._component.controls.id + 'step' + id,
            'class':'control-item btn',
            'type':'button',
            'data-bs-toggle':'collapse',
            'data-bs-target':'#' + this._component.controls.id + 'step' + id+'content',
            'aria-controls':this._component.controls.id + 'step' + id+'content',
            'aria-expanded':'false',
        }).appendTo(this._component.controls.list);
        control.id = control.attr('id');

        // Create Mobile Tab Nav
        control.mobile = $(document.createElement('li')).appendTo(this._component.controls.mobile.menu);
        control.mobile.btn = $(document.createElement('button')).attr({
            'id': control.id,
            'class': 'dropdown-item',
            'type': 'button',
            'role': 'tab',
            'data-bs-toggle': 'collapse',
            'data-bs-target':'#' + control.id+'content',
            'aria-expanded':'false',
            'aria-controls': control.id+'content',
        }).appendTo(control.mobile);
        control.mobile.label = $(document.createElement('span')).addClass('text-capitalize').appendTo(control.mobile.btn);

        // Set Control Class
        if(this._properties.class.control){
            control.addClass(this._properties.class.control);
        }
        if(properties.class.control){
            control.addClass(properties.class.control);
        }
        if(this._properties.class.mobile){
            control.mobile.btn.addClass(this._properties.class.mobile);
        }
        if(properties.class.mobile){
            control.mobile.btn.addClass(properties.class.mobile);
        }

        // Set Tooltip
        if(properties.tooltip){
            control.attr({
                "title": properties.tooltip,
                "data-bs-title": properties.tooltip,
            });
            new bootstrap.Tooltip(control);
        }

        // Set Color
        if(properties.color){
            control.addClass('btn-'+properties.color);
            control.mobile.btn.addClass('btn-'+properties.color);
        }

        // Set Numbered
        if(properties.numbered){
            control.text(id);
            control.mobile.label.text(id);
        }

        // Set Label
        if(properties.label){
            control.text(properties.label);
            control.mobile.label.text(properties.label);
        }

        // Set Icon
        if(properties.icon){
            control.icon = $(document.createElement('i')).addClass('bi bi-' + properties.icon).prependTo(control);
            control.mobile.icon = $(document.createElement('i')).addClass('me-2 bi bi-' + properties.icon).prependTo(control.mobile.btn);
            if(properties.label){
                control.icon.addClass('me-2');
                control.mobile.icon.addClass('me-2');
            }
        }

        // Create Step Content
        let content = $(document.createElement('div')).attr({
            'id':control.id+'content',
            'class':'fade collapse',
            'aria-labelledby':this._component.controls.id + id,
            'data-bs-parent':'#' + this._component.steps.id,
        }).appendTo(this._component.steps.accordion);
        content.id = content.attr('id');
        content.bootstrap = new bootstrap.Collapse(content,{toggle:false});

        // Set Content Class
        if(this._properties.class.content){
            content.addClass(this._properties.class.content);
        }
        if(properties.class.content){
            content.addClass(properties.class.content);
        }

        // Set Step
        const step = {content:content,control:control,properties:properties,id:id};

        // Save Step
        this._steps[id] = step;

        // Set Step Content Events
        content.on('hide.bs.collapse', function (event) {

            // Execute Callback
            if(typeof properties.callback.hide === 'function'){
                properties.callback.hide(event,step,self);
            }
        });
        content.on('hidden.bs.collapse', function (event) {

            // Execute Callback
            if(typeof properties.callback.hidden === 'function'){
                properties.callback.hidden(event,step,self);
            }
        });
        content.on('shown.bs.collapse', function (event) {

            // Calculate Progress Bar Width
            self.#calc(step);

            // Execute Callback
            if(typeof properties.callback.shown === 'function'){
                properties.callback.shown(event,step,self);
            }
        });
        content.on('show.bs.collapse', function (event) {

            // Set Current Step
            self.#current = step.id;

            // Check if Step is First
            if(step.id === 1){
                self._component.pagination.previous.attr('disabled',true).attr('data-bs-target','');
            } else {
                self._component.pagination.previous.attr('disabled',false).attr('data-bs-target','#' + self._component.id + 'controlsstep' + (step.id - 1) + 'content');
            }

            // Check if Step is Last
            if(step.id === self._counter){
                self._component.pagination.next.attr('disabled',true).attr('data-bs-target','');
            } else {
                self._component.pagination.next.attr('disabled',false).attr('data-bs-target','#' + self._component.id + 'controlsstep' + (step.id + 1) + 'content');
            }

            // Set Steps
            for (let id = 1; id <= self._counter; id++) {
                self._steps[id].control.removeClass('active');
                if(id <= step.id){
                    self._steps[id].control.addClass('active');
                }
                if(id !== step.id && self._steps[id].content.hasClass('show')){
                    self._steps[id].content.bootstrap.hide();
                    self._steps[id].control.attr('aria-expanded',false);
                } else {
                    self._steps[id].control.attr('aria-expanded',true);
                    self._steps[id].control.mobile.btn.attr('aria-expanded',true);
                    self._component.controls.mobile.current.html(self._steps[id].control.html());
                }
            }

            // Calculate Progress Bar Width
            self.#calc(step);

            // Execute Callback
            if(typeof properties.callback.show === 'function'){
                properties.callback.show(event,step,self);
            }
        });

        // Check if Step is First
        if(step.id === 1 && this._properties.showFirst){
            content.bootstrap.show();
        }

        // Check if Stepper contains a single step
        if(this._counter > 1 && this._component.pagination.next.attr('disabled') === 'disabled'){
            this._component.pagination.next.attr('disabled',false).attr('data-bs-target','#' + self._component.id + 'controlsstep' + step.id + 'content');
        }

        // Execute Callback
        if(typeof callback === 'function'){
            callback(step,this);
        }

        // Return Object
        return this;
    }

    next(){
        if(this._component.pagination.next.attr('disabled') !== 'disabled'){
            this._component.pagination.next.trigger('click');
        }
        return this;
    }

    previous(){
        if(this._component.pagination.previous.attr('disabled') !== 'disabled'){
            this._component.pagination.previous.trigger('click');
        }
        return this;
    }

    controls(){
        return this._component.controls;
    }

    pagination(){
        return this._component.pagination;
    }

    #calc(step){

        // Set Self
        const self = this;

        // Add Timeout to ensure the DOM is updated
        setTimeout(function() {

            // Set Progress Bar Width
            let width = 0;
            if(self._counter > 1){
                width = (((parseInt(step.id) - 1) / (self._counter - 1)) * 100);
            }
            if(self._component.progress.find('.progress-bar').length > 1){

                // Calculate width for stacked progress bar for multiple progress bars
                self._component.progress.find('.progress-bar:not(.stepper-progress)').each(function(index, element) {
                    const $el = $(this);
                    const pct = ($el.outerWidth() / $el.parent().width()) * 100;
                    width = (width - pct);
                });
            }
            self._component.progress.bar.css('width',width.toFixed(2) + '%');
        }, 300);
    }

    #wireSequentialAccordion() {
        const accEl = this._component?.steps?.accordion?.get(0);
        if (!accEl) return;

        // Delegate clicks from any toggle inside this component (controls, mobile, pagination)
        this._component.on('click', '[data-bs-toggle="collapse"]', (e) => {
            const btn = e.currentTarget;
            const targetSel = btn.getAttribute('data-bs-target') || btn.getAttribute('href');
            if (!targetSel) return;

            const targetEl = document.querySelector(targetSel);
            if (!targetEl || !accEl.contains(targetEl)) return; // ignore toggles outside our accordion

            const openEl = accEl.querySelector('.accordion-collapse.show');

            // If a transition is in progress, queue the last request
            if (this.#isAnimating) {
                e.preventDefault();
                this.#pendingTarget = targetSel;
                return;
            }

            // If switching from one open panel to another, close first, then open next
            if (openEl && openEl !== targetEl) {
                e.preventDefault();
                this.#isAnimating = true;
                this.#pendingTarget = targetSel;

                const inst = bootstrap.Collapse.getOrCreateInstance(openEl);
                const onHidden = () => {
                    openEl.removeEventListener('hidden.bs.collapse', onHidden);
                    const nextEl = document.querySelector(this.#pendingTarget);
                    this.#pendingTarget = null;

                    if (nextEl) {
                        const nextInst = bootstrap.Collapse.getOrCreateInstance(nextEl);
                        nextInst.show();
                    }
                    this.#isAnimating = false;
                };
                openEl.addEventListener('hidden.bs.collapse', onHidden, { once: true });
                inst.hide();
            }
        });
    }
});
